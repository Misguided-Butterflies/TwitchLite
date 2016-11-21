import React from 'react';
import 'twitch-embed';

const proportionOfScreenToFill = .75;
const heightWidthRatio = 9 / 16;

class TwitchEmbed extends React.Component {
  constructor(props) {
    super(props);
    this.divId = 'twitch-embed' + this.props.id + this.props.startString;

    this.handleFirstPlay = this.handleFirstPlay.bind(this);
    this.handleAdditionalPlay = this.handleAdditionalPlay.bind(this);
    this.handleFirstPause = this.handleFirstPause.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleHighlightEnd = this.handleHighlightEnd.bind(this);
    this.loadVideo = this.loadVideo.bind(this);
    this.checkChatTime = this.checkChatTime.bind(this);

  }

  loadVideo() {
    this.refs.base.innerHTML = '';
    this.createTwitchPlayer();
    this.player.play();
  }

  createTwitchPlayer() {
    let options = {
      width: this.props.embedWidth,
      height: this.props.embedHeight,
      video: this.props.id,
      time: this.props.startString,
      autoplay: false
    };
    this.player = new Twitch.Player(this.divId, options);
    this.player.addEventListener(Twitch.Player.PLAY, this.handleFirstPlay);
    this.player.addEventListener(Twitch.Player.PAUSE, this.handleFirstPause);
    this.player.addEventListener(Twitch.Player.PAUSE, this.handlePause);
  }

  // runs the first time play is pressed on the video. sets up an event to pause the video at the end of the highlight duration.
  handleFirstPlay() {
    this.active = true;
    this.player.removeEventListener(Twitch.Player.PLAY, this.handleFirstPlay);
    this.player.addEventListener(Twitch.Player.PLAY, this.handleAdditionalPlay);
    setTimeout(this.handleHighlightEnd, this.props.duration * 1000);
    this.chatInterval = setInterval(this.checkChatTime, 100);
  }

  checkChatTime() {
    if (this.active) {
      // Multiply by 1000 to convert from s -> ms
      // Get current time is relative to start of stream, not start of highlight
      // Thus we have to subtract this.props.startTime ( * 1000, because it is
      // also in seconds) to get the delta we're after
      this.props.handleTimeChange((this.player.getCurrentTime() * 1000) - this.props.startTime * 1000);
      return;
    }

    clearInterval(this.chatInterval);
  }

  // runs on subsequent play events, including seeking and buffering. checks to see if we're still inside the highlight duration,
  // and sets the highlight to inactive if not.
  handleAdditionalPlay() {
    this.active = true;
    clearInterval(this.chatInterval);
    this.chatInterval = setInterval(this.checkChatTime, 100);
    let currentTime = this.player.getCurrentTime();
    if (currentTime < this.props.startTime || currentTime > this.props.startTime + this.props.duration) {
      this.active = false;
      this.player.removeEventListener(Twitch.Player.PLAY, this.handleAdditionalPlay);
    } else {
      setTimeout(this.handleHighlightEnd, Math.ceil(this.props.duration - currentTime + this.props.startTime) * 1000);
    }
  }

  handlePause() {
    this.active = false;
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
      <div className='twitch-embed' id={this.divId} ref='base'>
        <img
          src={this.props.preview}
          onClick={this.loadVideo}
          className='video-preview'
        />
      </div>
    );
  }
}

/*
render() {
  return (
    <div id={this.divId} ref='base'>
      <img
        src={this.props.preview}
        onClick={this.loadVideo}
        height={this.props.embedHeight}
        width={this.props.embedWidth}
        className='video-preview'
      />
    </div>
  );
}
*/

TwitchEmbed.propTypes = {
  id: React.PropTypes.string.isRequired,
  startTime: React.PropTypes.number.isRequired,
  startString: React.PropTypes.string.isRequired,
  duration: React.PropTypes.number.isRequired,
  preview: React.PropTypes.string,
  handleTimeChange: React.PropTypes.func.isRequired,
  embedHeight: React.PropTypes.number.isRequired,
  embedWidth: React.PropTypes.number.isRequired
};

export default TwitchEmbed;
