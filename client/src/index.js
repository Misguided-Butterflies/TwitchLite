import React from 'react';
import {render} from 'react-dom';
import Header from './Header';
import Video from './Video';


class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Video video={{
          start: '1h',
          id: 'v97978712'
        }} />
        <Video video={{
          start: '2h6s',
          id: 'v97978712'
        }} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));