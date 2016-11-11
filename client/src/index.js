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
          start: 3600,
          id: 'v97978712',
          duration: 10,
        }} />
        <Video video={{
          start: 7206,
          id: 'v97978712',
          duration: 6,
        }} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));