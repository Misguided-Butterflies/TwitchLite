import React from 'react';
import 'twitch-embed';

class TwitchEmbed extends React.Component {
  constructor(props) {
    super(props);
    this.divId = 'twitch-embed' + this.props.id + this.props.startString;

    this.handleFirstPlay = this.handleFirstPlay.bind(this);
    this.handleAdditionalPlay = this.handleAdditionalPlay.bind(this);
    this.handleFirstPause = this.handleFirstPause.bind(this);
    this.handleHighlightEnd = this.handleHighlightEnd.bind(this);
  }

  componentDidMount() {
    var options = {
      width: 854,
      height: 480,
      video: this.props.id,
      time: this.props.startString,
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
    setTimeout(this.handleHighlightEnd, this.props.duration * 1000);
  }

  // runs on subsequent play events, including seeking and buffering. checks to see if we're still inside the highlight duration,
  // and sets the highlight to inactive if not.
  handleAdditionalPlay() {
    let currentTime = this.player.getCurrentTime();
    if (currentTime < this.props.startTime || currentTime > this.props.startTime + this.props.duration) {
      this.active = false;
      this.player.removeEventListener(Twitch.Player.PLAY, this.handleAdditionalPlay);
    } else {
      setTimeout(this.handleHighlightEnd, Math.ceil(this.props.duration - currentTime + this.props.startTime) * 1000);
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
      if (currentTime > this.props.startTime + this.props.duration) {
        this.player.pause();
      } else {
        setTimeout(this.handleHighlightEnd, Math.ceil(this.props.duration - currentTime + this.props.startTime) * 1000);
      }
    }
  }

  render() {
    return (
      <div id={this.divId}></div>
    );
  }
}

TwitchEmbed.propTypes = {
  id: React.PropTypes.string.isRequired,
  startTime: React.PropTypes.number.isRequired,
  startString: React.PropTypes.string.isRequired,
  duration: React.PropTypes.number.isRequired
};

export default TwitchEmbed;