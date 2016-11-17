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

    this.state = {
      voteCount: this.calculateVotes(props.video.votes),
      userVote: props.video.votes[props.username] || 0
    };

    this.calculateVotes = this.calculateVotes.bind(this);
    this.sendVote = this.sendVote.bind(this);
    this.updateUserVote = this.updateUserVote.bind(this);
  }

  calculateVotes(votes) {
    var total = 0;
    var votedUsers = Object.keys(votes);

    for (let user of votedUsers) {
      total += votes[user];
    }

    return total;
  }

  updateUserVote(vote) {
    if (vote === this.state.userVote) {
      // If we're trying to update the vote to be what it already is, that means
      // we're simply toggling the current vote, ie turning it into 0
      this.setState({
        voteCount: this.state.voteCount - vote,
        userVote: 0
      });

      return;
    }

    this.setState({
      voteCount: this.state.voteCount + (vote - this.state.userVote),
      userVote: vote
    });

    this.sendVote(vote);
  }

  sendVote(vote) {
    // axios.post('/votes', {
    //   // username
    //   // video id
    //   // vote
    // })
    // .then(updatedVideo => {
    //   // set state to calculateVotes(updatedVideo.votes); ???
    //   // no, we need optimistic updates instead
    // });
  }

  render() {
    let upvoteClass = this.state.userVote === 1 ? 'upvote active' : 'upvote';
    let downvoteClass = this.state.userVote === -1 ? 'downvote active' : 'downvote';

    return (
      <div className='video-container'>
      <h2>{this.props.video.streamTitle}</h2>
      <h3>Playing: {this.props.video.game}</h3>
      {
        this.props.username ?
        (
          <button
            onClick={this.updateUserVote.bind(this, 1)}
            className={upvoteClass}
          >
            upvote
          </button>
        ) :
        null
      }
      <div className='vote-count'>{this.state.voteCount}</div>
      {
        this.props.username ?
        (
          <button
            onClick={this.updateUserVote.bind(this, -1)}
            className={downvoteClass}
          >
            downvote
          </button>
        ) :
        null
      }
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
  username: React.PropTypes.string
};

export default VideoContainer;
