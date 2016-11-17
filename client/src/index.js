import React from 'react';
import {render} from 'react-dom';
import {Button, ButtonToolbar} from 'react-bootstrap';
import Header from './Header';
import Menu from './Menu';
import VideoList from './VideoList';

const numberOfVideosToShowPerPage = 5;

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
      multiplier: false,
      age: true,
      following: false
    };
    //current highlight list, refiltered from allHighlights OTF
    this.myHighlights = null;
    
 

    this.sortByMultiplier = this.sortByMultiplier.bind(this);
    this.sortByAge = this.sortByAge.bind(this);
    this.sortByFollowing = this.sortByFollowing.bind(this);
    this.updateList = this.updateList.bind(this);
    this.increaseList = this.increaseList.bind(this);

    //refrences all sort functions from one object
    this.sortFunctions = {
      mult: this.sortByMultiplier,
      age: this.sortByAge,
      follow: this.sortByFollowing
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
        this.sortByAge();
      }
    });
  }

  sortByMultiplier() {
    this.selected.multiplier = true;
    this.selected.age = false;
    this.updateList(0);
  }

  sortByAge() {
    this.selected.multiplier = false;
    this.selected.age = true;
    this.updateList(0);
  }
  
  sortByFollowing(followArr) {
    //Toggles whether or not to filter by following stram
    this.selected.following = !this.selected.following;
    this.updateList(0);    
  };
  
  filter() {
    //filters allHighlights into myHighlights
    this.myHighlights = this.allHighlights.slice(0);
    if (this.selected.following) {
      var arr = this.state.following;
      this.myHighlights = this.myHighlights.filter(function (elem) {
        return arr.indexOf(elem.channelName) > -1 ? true : false;
      });
    }
    if (this.selected.age) {
      this.myHighlights.sort((a, b) => b.highlightStart - a.highlightStart);
    }
    if (this.selected.multiplier) {
      this.myHighlights.sort((a, b) => b.multiplier - a.multiplier);
    }
  }

  updateList(start) {
    //filter list into myHighlights
    this.filter();
    
    //change state
    this.setState({
      list: this.myHighlights.slice(start, start + numberOfVideosToShowPerPage),
      next: start + numberOfVideosToShowPerPage,
    });
  }

  increaseList() {
    this.setState({
      list: this.myHighlights.slice(0, this.state.next + numberOfVideosToShowPerPage),
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
        <Menu sort={this.sortFunctions} updateUser={this.updateUser.bind(this)}/>
        <VideoList list={this.state.list} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
