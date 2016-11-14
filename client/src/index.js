import React from 'react';
import {render} from 'react-dom';
import Header from './Header';
import VideoList from './VideoList';
import $ from 'jquery';

let testVideos = [
  {
    id: 'v97978712',
    start: 7206,
    duration: 6,
  }, {
    id: 'v99478815',
    start: 9342,
    duration: 55,
  }, {
    id: 'v100239687',
    start: 22,
    duration: 9,
  }
];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    };

    this.allHighlights = [];
  }

  componentWillMount() {
    $.ajax({
      method: 'GET',
      url: '/highlights',
      success: response => {
        this.allHighlights = response;
        this.allHighlights.sort((a, b) => b.highlightStart - a.highlightStart);
        this.setState({
          list: this.allHighlights.slice(0, 10)
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Header />
        <VideoList list={this.state.list} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));