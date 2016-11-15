import React from 'react';
import {render} from 'react-dom';
import {Button, ButtonToolbar} from 'react-bootstrap';
import Header from './Header';
import VideoList from './VideoList';
import $ from 'jquery';

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
  }

  /** componentWillMount
   * runs once when component loads
   * fetches all highlights from the database
   * sorts those highlights by newest first
   * sets the first 10 highlights to be shown on the page
   */
  componentWillMount() {
    $.ajax({
      method: 'GET',
      url: '/highlights',
      success: response => {
        this.allHighlights = response;
        console.log('response received', this.allHighlights);
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
      list: this.allHighlights.slice(start, start + 5),
      start: start,
    });
  }

  render() {
    return (
      <div>
        <Header />
        <ButtonToolbar>
          <Button onClick={this.sortByMultiplier}>Hottest first</Button>
          <Button onClick={this.sortByAge}>Newest first</Button>
        </ButtonToolbar>
        <VideoList list={this.state.list} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
