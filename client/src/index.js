import React from 'react';
import {render} from 'react-dom';
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