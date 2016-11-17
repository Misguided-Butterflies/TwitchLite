import React from 'react';
import {render} from 'react-dom';
import {Button, ButtonToolbar} from 'react-bootstrap';
import Header from './Header';
import Menu from './Menu';
import VideoList from './VideoList';
import axios from 'axios';
import utils from './utils';

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
      following: [],
    };

    
    //initialize twitch SDK
    Twitch.init({clientId: process.env.TWITCH_CLIENT_ID}, (error, status) => this.status = status);
    
    //single source of truth for highlights
    this.allHighlights = [];
    //logs all games for which we have a highlight. passes this to menu component
    this.allGames = {};
    //tracks which sorting options are chosen
    this.selected = {
      sortType: 'hotness',
      following: false,
      search: '',
      games: ['Counter-Strike: Global Offensive']
    };
    //current highlight list, refiltered from allHighlights OTF
    this.myHighlights = null;

    this.sortByMultiplier = this.sortByMultiplier.bind(this);
    this.sortByAge = this.sortByAge.bind(this);
    this.sortByFollowing = this.sortByFollowing.bind(this);
    this.sortByGame = this.sortByGame.bind(this);
    this.sortByHotness = this.sortByHotness.bind(this);
    this.updateList = this.updateList.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.increaseList = this.increaseList.bind(this);
    this.checkScrollBottom = this.checkScrollBottom.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    //refrences all sort functions from one object
    this.sortFunctions = {
      mult: this.sortByMultiplier,
      age: this.sortByAge,
      hotness: this.sortByHotness,
      follow: this.sortByFollowing,
      search: this.handleSearch
    };

    window.addEventListener('scroll', () => {
      this.checkScrollBottom();
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
   * fetches all highlights from the database
   * sorts those highlights by newest first
   * writes to allGames array
   * sets the first numberOfVideosToShowPerPage highlights to be shown on the page
   */
  componentWillMount() {
<<<<<<< 0dd521768886015ebdd0dfde0021460044ae7a66
    axios.get('/highlights')
    .then(response => {
      this.allHighlights = response.data;
      this.sortByAge();
=======
    $.ajax({
      method: 'GET',
      url: '/highlights',
      success: response => {
        this.allHighlights = response;
        for (let highlight of response) {
          if (!this.allGames[highlight.game]) {
            this.allGames[highlight.game] = 0;
          }
          this.allGames[highlight.game]++;
        }
        this.updateList(0);
      }
>>>>>>> working on game
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

  sortByMultiplier() {
    this.selected.sortType = 'multiplier';
    this.updateList();
  }

  sortByAge() {
    this.selected.sortType = 'age';
    this.updateList();
  }

  sortByFollowing() {
    //Toggles whether or not to filter by following stram
    this.selected.following = !this.selected.following;
    this.updateList();
  }
  
  sortByGame(game) {
    //toggles game filter
    let gameIndex = this.selected.games.indexOf(game);
    if (gameIndex > -1) {
      this.selected.games.splice(gameIndex, 1);
    } else {
      this.selected.games.push(game);
    }
    this.updateList();
  }
  
  filter() {
    //filters allHighlights into myHighlights
    this.myHighlights = this.allHighlights.slice(0);
    if (this.selected.following) {
      let arr = this.state.following;
      this.myHighlights = this.myHighlights.filter(function (elem) {
        return arr.indexOf(elem.channelName) > -1 ? true : false;
      });
    }
    if (this.selected.search) {
      this.myHighlights = this.myHighlights.filter(highlight =>
        (highlight.channelName + highlight.game + highlight.streamTitle).match(new RegExp(utils.escapeRegex(this.selected.search), 'i'))
      );

    if (this.selected.games.length > 0) {
      let arr = this.selected.games
      this.myHighlights = this.myHighlights.filter(function (elem) {
        return arr.indexOf(elem.game) > -1 ? true: false;
      });
    }
    if (this.selected.sortType === 'age') {
      this.myHighlights.sort((a, b) => b.highlightStart - a.highlightStart);
    }
    if (this.selected.sortType === 'multiplier') {
      this.myHighlights.sort((a, b) => b.multiplier - a.multiplier);
    }
    if (this.selected.sortType === 'hotness') {
      this.myHighlights.sort((a, b) => this.calculateHotness(b) - this.calculateHotness(a));
    }
  }

  updateList() {
    //filter list into myHighlights
    this.filter();

    //change state
    this.setState({
      list: this.myHighlights.slice(0, numberOfVideosToShowPerPage),
      next: numberOfVideosToShowPerPage,
    });
  }

  increaseList() {
    this.setState({
      list: this.myHighlights.slice(0, Math.min(this.state.next + numberOfVideosToShowPerPage, this.myHighlights.length)),
      next: this.state.next + numberOfVideosToShowPerPage
    });
  }

  updateUser(info) {
    //if user is logging out, sets following filter to false
    if (info.name === '') {
      this.selected.following = false;
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
        <Header />
<<<<<<< 0dd521768886015ebdd0dfde0021460044ae7a66
        <Menu sort={this.sortFunctions} updateUser={this.updateUser} twitchStatus={this.status}/>
        <VideoList list={this.state.list} username={this.state.name} />
=======
        <Menu sort={this.sortFunctions} updateUser={this.updateUser} twitchStatus={this.status} games={this.allGames}/>
        <VideoList list={this.state.list} />
>>>>>>> working on game
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
