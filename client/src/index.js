import React from 'react';
import {render} from 'react-dom';
import Menu from './Menu';
import VideoList from './VideoList';
import axios from 'axios';
import utils from './utils';

const timeBetweenNewHighlightsCheck = 5000;
const numberOfVideosToShowPerPage = 5;
const dateRedditUsesForTheirAlgorithm = 1134028003000;
const baseMultiplier = 7;
const mulitplierScalingFactor = 1; // how many additional votes does it take to have the same weight as 1 additional point of multiplier?

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      name: '',
      followedChannels: [],
      followedGames: [],
      newHighlights: 0
    };
    this.getEmotes();

    //initialize twitch SDK
    Twitch.init({clientId: process.env.TWITCH_CLIENT_ID}, (error, status) => this.status = status);

    //single source of truth for highlights
    this.allHighlights = [];
    //tracks which sorting options are chosen
    this.selected = {
      sortType: 'hotness',
      followedChannels: false,
      followedGames: false,
      search: '',
    };
    //current highlight list, filtered from allHighlights when option is selected
    this.myHighlights = null;

    this.sortByAge = this.sortByAge.bind(this);
    this.sortByFollowedChannels = this.sortByFollowedChannels.bind(this);
    this.sortByFollowedGames = this.sortByFollowedGames.bind(this);
    this.sortByHotness = this.sortByHotness.bind(this);
    this.updateList = this.updateList.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.updateAllHighlights = this.updateAllHighlights.bind(this);
    this.updateHighlightCount = this.updateHighlightCount.bind(this);
    this.increaseList = this.increaseList.bind(this);
    this.checkScrollBottom = this.checkScrollBottom.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    //refrences all sort functions from one object
    this.sortFunctions = {
      age: this.sortByAge,
      hotness: this.sortByHotness,
      followedChannels: this.sortByFollowedChannels,
      followedGames: this.sortByFollowedGames,
      search: this.handleSearch
    };

    window.addEventListener('scroll', () => {
      this.checkScrollBottom();
    });
  }

  getEmotes() {
    axios.get('/emotes')
    .then(response => {
      this.setState({
        emotes: JSON.parse(response.data)
      });
    });
  }

  checkScrollBottom() {
    var $body = document.body;
    var $html = document.documentElement;

    var scrollTop = window.pageYOffset;
    var docHeight = Math.max($body.scrollHeight, $body.offsetHeight,
      $html.clientHeight, $html.scrollHeight, $html.offsetHeight);
    var windowHeight = window.innerHeight;

    if (scrollTop === docHeight - windowHeight) {
      this.increaseList();
    }
  }

  /** componentWillMount
   * runs once when component loads
   * fetches all highlights from the database first
   * sets an interval for fetching highlight count to 5s
   * creates an interval object to later clear if needed
   * sets the first numberOfVideosToShowPerPage highlights to be shown on the page
   */
  componentWillMount() {
    this.updateAllHighlights();
    var updateInterval = setInterval(this.updateHighlightCount, timeBetweenNewHighlightsCheck);
    this.setState({interval: updateInterval});
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  //checks for new highlights, put into allHighlights
  updateAllHighlights() {
    axios.get('/highlights')
    .then(response => {
      this.allHighlights = response.data;
      this.setState({newHighlights: 0});
      this.sortByAge();
    });
  }

  //gets count of new highlights
  updateHighlightCount() {
    axios.get('/highlights/count')
    .then(response => {
      let diff = parseInt(response.data) - this.allHighlights.length;
      if (diff > this.state.newHighlights) {
        this.setState({newHighlights: diff});
      }
    });
  }

  sortByHotness() {
    this.selected.sortType = 'hotness';
    this.updateList();
  }

  calculateHotness(video) {
    let score = 0;
    for (let key in video.votes) {
      score += video.votes[key];
    }
    score += (video.multiplier - baseMultiplier) * mulitplierScalingFactor;
    let order = Math.log10(Math.max(Math.abs(score), 1));
    let sign = score > 0 ? 1 : score < 0 ? -1 : 0;
    let seconds = (video.highlightStart - dateRedditUsesForTheirAlgorithm) / 1000;
    return sign * order + seconds / 45000;
  }

  sortByAge() {
    //updates allHighlights with new data
    if (this.state.newHighlights) {
      this.updateAllHighlights();
    } else {
      this.selected.sortType = 'age';
      this.updateList();
    }
  }

  sortByFollowedChannels() {
    //Toggles whether or not to filter by following channels
    this.selected.followedChannels = !this.selected.followedChannels;
    this.updateList();
  }

  sortByFollowedGames() {
    //Toggles whether or not to filter by following games
    this.selected.followedGames = !this.selected.followedGames;
    this.updateList();
  }

  filter() {
    //get highlights from allHighlights
    this.myHighlights = this.allHighlights.slice(0);
    if (this.selected.followedChannels) {
      let arr = this.state.followedChannels;
      this.myHighlights = this.myHighlights.filter(function (elem) {
        return arr.indexOf(elem.channelName) > -1 ? true : false;
      });
    }
    if (this.selected.followedGames) {
      let arr = this.state.followedGames;
      this.myHighlights = this.myHighlights.filter(function (elem) {
        return arr.indexOf(elem.game) > -1 ? true : false;
      });
    }
    if (this.selected.search) {
      this.myHighlights = this.myHighlights.filter(highlight =>
        (highlight.channelName + highlight.game + highlight.streamTitle).match(new RegExp(utils.escapeRegex(this.selected.search), 'i'))
      );
    }
    if (this.selected.sortType === 'age') {
      this.myHighlights.sort((a, b) => b.highlightStart - a.highlightStart);
    }
    if (this.selected.sortType === 'hotness') {
      this.myHighlights.sort((a, b) => this.calculateHotness(b) - this.calculateHotness(a));
    }
  }

  updateList() {
    //filter list into myHighlights
    this.filter();
    this.setState({
      list: this.myHighlights ? this.myHighlights.slice(0, numberOfVideosToShowPerPage) : [],
      next: numberOfVideosToShowPerPage,
    });
  }

  increaseList() {
    this.setState({
      list: this.myHighlights ? this.myHighlights.slice(0, Math.min(this.state.next + numberOfVideosToShowPerPage, this.myHighlights.length)) : [],
      next: this.state.next + numberOfVideosToShowPerPage
    });
  }

  updateUser(info) {
    //if user is logging out, sets following filter to false
    if (info.name === '') {
      this.selected.followedChannels = false;
      this.selected.followedGames = false;
    }
    //updates userData object with info
    this.setState(info);
  }


  handleSearch(e) {
    this.selected.search = e.target.value;
    this.updateList();
  }

  render() {
    return (
      <div>
        <Menu sort={this.sortFunctions} updateUser={this.updateUser} twitchStatus={this.status} newHighlights={this.state.newHighlights}/>
        <VideoList list={this.state.list} username={this.state.name} emotes={this.state.emotes} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
