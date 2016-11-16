import React from 'react';
import 'twitch-embed';
import TwitchEmbed from '../TwitchEmbed';
import ReactDOM from 'react-dom';

/** Video
 * this is a component for showing a twitch vod highlight.
 * usage:
 * let video = {
 *   id: 'v97978712', // twitch video id
 *   start: 7206, // start time of the hightlight in seconds
 *   duration: 15, // duration of the highlight in seconds
 * };
 * // ...
 * <Video video={video} />
 */
class Video extends React.Component {
  constructor(props) {
    super(props);
  }

  // twitch player wants a string like "1h3m44s" as the start time. this function converts a number of seconds to that format.
  getStartString() {
    let result = '';
    if (this.props.video.start >= 3600) {
      result += Math.floor(this.props.video.start / 3600) + 'h';
    }
    if (this.props.video.start % 3600 >= 60) {
      result += Math.floor((this.props.video.start % 3600) / 60) + 'm';
    }
    if (this.props.video.start % 60 > 0) {
      result += (this.props.video.start % 60) + 's';
    }
    return result;
  }

  componentDidMount() {
    this.addNewPlayer();
  }

  componentDidUpdate() {
    this.removePlayer();
    this.addNewPlayer();
  }

  removePlayer() {
    document.querySelector(this.refs.video).innerHTML = '';
  }

  addNewPlayer() {
    ReactDOM.render(<TwitchEmbed
      id={this.props.video.id}
      startTime={this.props.video.start}
      startString={this.getStartString()}
      duration={this.props.video.duration}
      preview={this.props.video.preview}
    />, this.refs.video);
  }

  render() {
    return (
      <div className='video' ref='video'></div>
    );
  }
}

Video.propTypes = {
  video: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    start: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number.isRequired,
    preview: React.PropTypes.string.isRequired,
  }).isRequired,
};

export default Video;
