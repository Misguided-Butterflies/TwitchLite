import React from 'react';
import Video from '../Video';
import axios from 'axios';

const numberOfSecondsToAddToBeginningOfHighlights = 30;

/** VideoComponent
 * this is a component that wraps <Video> and handles all other UI and logic
 * for rendering a <Video>
 * usage:
 * <VideoContainer video={video} />
 */
class VideoContainer extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   // voteCount:
    //   userVote: 0 // initial val should be based on props.votes
    // };

    this.sendVote = this.sendVote.bind(this);
  }

  calculateVotes(votes) {
    var total = 0;

    var votedUsers = Object.keys(votes);

    for (let user of votedUsers) {
      total += votes[user];
    }

    return total;
  }

  sendVote(vote) {
    axios.post('/votes', {
      // username
      // video id
      // vote
    })
    .then(updatedVideo => {

    });
  }

  render() {
    return (
      <div className='video-container'>
      <h2>{this.props.video.streamTitle}</h2>
      <h3>Playing: {this.props.video.game}</h3>
      <Video video={{
        id: this.props.video.vodId,
        preview: this.props.video.preview,
        start: Math.floor((this.props.video.highlightStart - this.props.video.streamStart) / 1000) - numberOfSecondsToAddToBeginningOfHighlights,
        duration: Math.floor((this.props.video.highlightEnd - this.props.video.highlightStart) / 1000) + numberOfSecondsToAddToBeginningOfHighlights
      }} />
      </div>
    );
  }
}

VideoContainer.propTypes = {
  video: React.PropTypes.shape({
    vodId: React.PropTypes.string.isRequired,
    channelName: React.PropTypes.string.isRequired,
    game: React.PropTypes.string.isRequired,
    preview: React.PropTypes.string.isRequired,
    streamStart: React.PropTypes.number.isRequired,
    streamTitle: React.PropTypes.string.isRequired,
    highlightStart: React.PropTypes.number.isRequired,
    highlightEnd: React.PropTypes.number.isRequired,
    multiplier: React.PropTypes.number.isRequired,
    votes: React.PropTypes.object.isRequired,
  }).isRequired,
};

export default VideoContainer;
