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
    $(this.refs.video).empty();
  }

  addNewPlayer() {
    ReactDOM.render(<TwitchEmbed id={this.props.video.id} startTime={this.props.video.start} startString={this.getStartString()} duration={this.props.video.duration} />, this.refs.video);
  }

  render() {
    return (
      <div className='video' ref='video'></div>
    );
  }
}

Video.propTypes = {
  video: React.PropTypes.object.isRequired,
};

export default Video;