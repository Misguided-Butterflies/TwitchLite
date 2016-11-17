import React from 'react';
import {render} from 'react-dom';
import {Button, ButtonToolbar} from 'react-bootstrap';
import Header from './Header';
import Menu from './Menu';
import VideoList from './VideoList';

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
      following: []
    };

    //single source of truth for highlights
    this.allHighlights = [];
    //tracks which sorting options are chosen
    this.selected = {
      sortType: 'hotness',
      following: false
    };
    //current highlight list, refiltered from allHighlights OTF
    this.myHighlights = null;
    
 

    this.sortByMultiplier = this.sortByMultiplier.bind(this);
    this.sortByAge = this.sortByAge.bind(this);
    this.sortByFollowing = this.sortByFollowing.bind(this);
    this.sortByHotness = this.sortByHotness.bind(this);
    this.updateList = this.updateList.bind(this);
    this.increaseList = this.increaseList.bind(this);

    //refrences all sort functions from one object
    this.sortFunctions = {
      mult: this.sortByMultiplier,
      age: this.sortByAge,
      hotness: this.sortByHotness,
      follow: this.sortByFollowing,
    };
    
    $(() => {
      let $window = $(window);
      $window.scroll(() => {
        if ($window.scrollTop() === $(document).height() - $window.height()) {
          this.increaseList();
        }
      });
    });
  }

  /** componentWillMount
   * runs once when component loads
   * fetches all highlights from the database
   * sorts those highlights by newest first
   * sets the first numberOfVideosToShowPerPage highlights to be shown on the page
   */
  componentWillMount() {
    $.ajax({
      method: 'GET',
      url: '/highlights',
      success: response => {
        this.allHighlights = response;
        this.updateList(0);
      }
    });
  }

  sortByHotness() {
    this.selected.sortType = 'hotness';
    this.updateList();
  }

  calculateHotness(video) {
    let score = 0;
    for (key in video.votes) {
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
  
  filter() {
    //filters allHighlights into myHighlights
    this.myHighlights = this.allHighlights.slice(0);
    if (this.selected.following) {
      var arr = this.state.following;
      this.myHighlights = this.myHighlights.filter(function (elem) {
        return arr.indexOf(elem.channelName) > -1 ? true : false;
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
  
  render() {
    return (
      <div>
        <Header />
        <Menu sort={this.sortFunctions} updateUser={this.updateUser.bind(this)} />
        <VideoList list={this.state.list} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
