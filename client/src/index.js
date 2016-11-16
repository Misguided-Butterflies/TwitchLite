import React from 'react';
import {render} from 'react-dom';
import {Button, ButtonToolbar} from 'react-bootstrap';
import Header from './Header';
import Navbar from './Navbar';
import VideoList from './VideoList';

const numberOfVideosToShowPerPage = 5;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    };

    this.allHighlights = [];

    this.sortByMultiplier = this.sortByMultiplier.bind(this);
    this.sortByAge = this.sortByAge.bind(this);
    this.updateList = this.updateList.bind(this);
    this.increaseList = this.increaseList.bind(this);
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
    this.allHighlights.sort((a, b) => b.multiplier - a.multiplier);
    this.updateList(0);
  }

  sortByAge() {
    this.allHighlights.sort((a, b) => b.highlightStart - a.highlightStart);
    this.updateList(0);
  }

  updateList(start) {
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
        <Navbar />
        <ButtonToolbar>
          <Button onClick={this.sortByMultiplier}>Hottest first</Button>
          <Button onClick={this.sortByAge}>Newest first</Button>
        </ButtonToolbar>
        <VideoList list={this.state.list} />
        <Button onClick={this.increaseList}>More</Button>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
