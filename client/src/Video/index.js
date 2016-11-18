import React from 'react';
import 'twitch-embed';
import TwitchEmbed from '../TwitchEmbed';
import ReactDOM from 'react-dom';
import utils from '../utils';

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

  componentDidMount() {
    this.addNewPlayer();
  }

  componentDidUpdate() {
    this.removePlayer();
    this.addNewPlayer();
  }

  removePlayer() {
    this.refs.video.innerHTML = '';
  }

  addNewPlayer() {
    ReactDOM.render(<TwitchEmbed
      id={this.props.video.id}
      startTime={this.props.video.start}
      startString={utils.getStartString(this.props.video.start)}
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
  handleTimeChange: React.PropTypes.func.isRequired
};

export default Video;
