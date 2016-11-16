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
      list: []
    };

    //single source of truth for highlights
    this.allHighlights = [];
    //filtered highlight list for user's followed
    this.allMyHighlights = null;

    this.sortByMultiplier = this.sortByMultiplier.bind(this);
    this.sortByAge = this.sortByAge.bind(this);
    this.sortByFollowing = this.sortByFollowing.bind(this);
    this.updateList = this.updateList.bind(this);
    this.increaseList = this.increaseList.bind(this);

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
    if (!this.allMyHighlights) {
      //if not filtering by following
      this.allHighlights.sort((a, b) => b.multiplier - a.multiplier);
      this.updateList(0);
    } else {
      //if filtered by following
      this.allMyHighlights.sort((a, b) => b.multiplier - a.multiplier);
      this.updateList(0, this.allMyHighlights);
    }
  }

  sortByAge() {
    if (!this.allMyHighlights) {
      console.log('hello world');
      this.allHighlights.sort((a, b) => b.highlightStart - a.highlightStart);
      this.updateList(0);
    } else {
      this.allMyHighlights.sort((a, b) => b.highlightStart - a.highlightStart);
      this.updateList(0, this.allMyHighlights);  
    }
  }
  
  sortByFollowing(followArr) {
    //Toggles whether or not to filter by following stram
    if (this.allMyHighlights === null) {
      this.allMyHighlights = this.allHighlights.filter(function (elem) {
        return followArr.indexOf(elem.channelName) > -1 ? true : false;
      });
      this.updateList(0, this.allMyHighlights);
    } else {
      this.allMyHighlights = null;
      this.updateList(0);    
    }
  };

  updateList(start, list = this.allHighlights) {
    this.setState({
      list: this.allHighlights.slice(start, start + numberOfVideosToShowPerPage),
      next: start + numberOfVideosToShowPerPage,
    });
  }

  increaseList() {
    this.setState({
      list: this.allHighlights.slice(0, this.state.next + numberOfVideosToShowPerPage),
      next: this.state.next + numberOfVideosToShowPerPage
    });
  }

  render() {
    return (
      <div>
        <Header />
        <Menu sortMult={this.sortByMultiplier} sortAge={this.sortByAge} sortFollow={this.sortByFollowing}/>
        <VideoList list={this.state.list} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
