import React from 'react';

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.divId = props.video.id + props.video.start;
  }

  componentDidMount() {
    var options = {
      width: 854,
      height: 480,
      video: this.props.video.id,
      time: this.props.video.start,
      autoplay: false
    };
    var player = new Twitch.Player(this.divId, options);
    player.addEventListener(Twitch.Player.PAUSE, () => console.log('player is paused!'));
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