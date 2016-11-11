import React from 'react';
import 'twitch-embed';

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.divId = props.video.id + props.video.start;
    this.started = false;
    this.active = false;
    this.handleFirstPlay = this.handleFirstPlay.bind(this);
    this.handleFirstPause = this.handleFirstPause.bind(this);
  }

  componentDidMount() {
    var options = {
      width: 854,
      height: 480,
      video: this.props.video.id,
      time: this.props.video.start,
      autoplay: false
    };
    this.player = new Twitch.Player(this.divId, options);
    this.player.addEventListener(Twitch.Player.PLAY, this.handleFirstPlay);
    this.player.addEventListener(Twitch.Player.PAUSE, this.handleFirstPause);
  }

  handleFirstPlay() {
    console.log('handling first play');
    if (!this.started) {
      this.active = true;
    }
    this.started = true;
    this.player.removeEventListener(Twitch.Player.PLAY, this.handleFirstPlay);
  }

  handleFirstPause() {
    console.log('handling first pause');
    this.active = false;
    this.player.removeEventListener(Twitch.Player.PAUSE, this.handleFirstPause);
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