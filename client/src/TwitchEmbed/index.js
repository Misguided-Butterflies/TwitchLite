import React from 'react';
import 'twitch-embed';

const proportionOfScreenToFill = .75;
const heightWidthRatio = 9 / 16;

/** TwitchEmbed
 * this is the component for the actual twitch video player on the page.
 * it starts out as a preview image that turns into a twitch video embed when clicked on.
 * when clicked, the appropriate twitch player embed loads as described by the props.
 */
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
    this.getDimensions = this.getDimensions.bind(this);
  }

  getDimensions() {
    // Get the dimensions of the container element (which is handled in CSS)
    return {
      width: this.refs.base.offsetWidth,
      height: this.refs.base.offsetHeight
    };
  }

  loadVideo() {
    const dimensions = this.getDimensions();
    this.refs.base.innerHTML = '';
    // Pass up the video height so that <ChatsContainer> can resize
    // itself appropriately
    this.props.handleHeightCalculation(dimensions.height);
    // But use both width AND height when setting the dimensions of
    // the video player itself
    this.createTwitchPlayer(dimensions);
    this.player.play();
    this.props.fetchChat();
  }

  createTwitchPlayer({width, height}) {
    let options = {
      width,
      height,
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
          alt='Stream Preview'
          title='Stream Preview'
        />
      </div>
    );
  }
}


TwitchEmbed.propTypes = {
  id: React.PropTypes.string.isRequired,
  startTime: React.PropTypes.number.isRequired,
  startString: React.PropTypes.string.isRequired,
  duration: React.PropTypes.number.isRequired,
  preview: React.PropTypes.string,
  handleTimeChange: React.PropTypes.func.isRequired,
  handleHeightCalculation: React.PropTypes.func.isRequired
};

export default TwitchEmbed;
