import React from 'react';
import 'twitch-embed';

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
    this.startString = this.getStartString();
    this.divId = props.video.id + this.startString;

    // true if the highlight has started playing and hasn't been manually stopped.
    // once set back to false, the video will behave like a full VOD with no highlight features.
    this.active = false;

    // player event handlers
    this.handleFirstPlay = this.handleFirstPlay.bind(this);
    this.handleFirstPause = this.handleFirstPause.bind(this);
    this.handleHighlightEnd = this.handleHighlightEnd.bind(this);
    this.handleAdditionalPlay = this.handleAdditionalPlay.bind(this);
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
    var options = {
      width: 854,
      height: 480,
      video: this.props.video.id,
      time: this.startString,
      autoplay: false
    };
    this.player = new Twitch.Player(this.divId, options);
    this.player.addEventListener(Twitch.Player.PLAY, this.handleFirstPlay);
    this.player.addEventListener(Twitch.Player.PAUSE, this.handleFirstPause);
  }

  // runs the first time play is pressed on the video. sets up an event to pause the video at the end of the highlight duration.
  handleFirstPlay() {
    this.active = true;
    this.player.removeEventListener(Twitch.Player.PLAY, this.handleFirstPlay);
    this.player.addEventListener(Twitch.Player.PLAY, this.handleAdditionalPlay);
    setTimeout(this.handleHighlightEnd, this.props.video.duration * 1000);
  }

  // runs on subsequent play events, including seeking and buffering. checks to see if we're still inside the highlight duration,
  // and sets the highlight to inactive if not.
  handleAdditionalPlay() {
    let currentTime = this.player.getCurrentTime();
    if (currentTime < this.props.video.start || currentTime > this.props.video.start + this.props.video.duration) {
      this.active = false;
      this.player.removeEventListener(Twitch.Player.PLAY, this.handleAdditionalPlay);
    } else {
      setTimeout(this.handleHighlightEnd, Math.ceil(this.props.video.duration - currentTime + this.props.video.start) * 1000);
    }
  }

  // runs the first time the video is paused. sets it to inactive, thereby removing highlight functionality.
  handleFirstPause() {
    this.active = false;
    this.player.removeEventListener(Twitch.Player.PAUSE, this.handleFirstPause);
  }

  // checks if we're really at the end of the highlight, and pauses if so.
  handleHighlightEnd() {
    if (this.active) {
      let currentTime = this.player.getCurrentTime();
      if (currentTime > this.props.video.start + this.props.video.duration) {
        this.player.pause();
      } else {
        setTimeout(this.handleHighlightEnd, Math.ceil(this.props.video.duration - currentTime + this.props.video.start) * 1000);
      }
    }
  }

  render() {
    return (
      <div>
        <div className='video' id={this.divId}></div>
      </div>
    );
  }
}

Video.propTypes = {
  video: React.PropTypes.object.isRequired
};

export default Video;