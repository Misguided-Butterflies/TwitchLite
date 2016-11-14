import React from 'react';
import {render} from 'react-dom';
import Header from './Header';
import VideoList from './VideoList';

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
  render() {
    return (
      <div>
        <Header />
        <VideoList list={testVideos} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));