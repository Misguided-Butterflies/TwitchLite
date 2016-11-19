import React from 'react';
import Video from '../Video';
import ChatsContainer from '../ChatsContainer';
import axios from 'axios';
import {Row, Col} from 'react-bootstrap';

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
      userVote: this.getUserVote(props.username, props.video.votes),
      messagesPointer: 0
    };

    this.calculateVotes = this.calculateVotes.bind(this);
    this.sendVote = this.sendVote.bind(this);
    this.updateUserVote = this.updateUserVote.bind(this);
    this.getUserVote = this.getUserVote.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  getUserVote(username, votes) {
    if (votes.hasOwnProperty(username)) {
      return votes[username];
    }

    return 0;
  }

  handleTimeChange(msSinceHighlightStart) {
    var newPointer = this.state.messagesPointer;

    while (this.props.video.messages[newPointer] &&
      this.props.video.messages[newPointer].time <= this.props.video.highlightStart + msSinceHighlightStart) {
      newPointer++;
    }

    this.setState({
      messagesPointer: newPointer
    });
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

      this.sendVote(this.state.voteCount - vote);

      return;
    }

    this.setState({
      voteCount: this.state.voteCount + (vote - this.state.userVote),
      userVote: vote
    });

    this.sendVote(vote);
  }

  componentDidUpdate(prevProps) {
    // This check is here to prevent an infinite loop; we only want to do stuff
    // if the username has updated
    // See https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/postrender_with_componentdidupdate.html#another-render-pass
    if (prevProps.username === this.props.username) {
      return;
    }

    this.setState({
      userVote: this.getUserVote(this.props.username, this.props.video.votes)
    });
  }

  sendVote(vote) {
    axios.post('/votes', {
      vote,
      username: this.props.username,
      highlightId: this.props.video._id
    })
    .then(response => {
      return response.data;
    })
    .then(updatedVideo => {

    })
    .catch(error => {
      console.error('Error sending vote:', error);
    });
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
        <Row>
        <Col md={1}>
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
        </Col>
        <Col md={8}>
        <Video
          video={{
            id: this.props.video.vodId,
            preview: this.props.video.preview,
            start: Math.floor((this.props.video.highlightStart - this.props.video.streamStart) / 1000),
            duration: Math.floor((this.props.video.highlightEnd - this.props.video.highlightStart) / 1000)
          }}
          handleTimeChange={this.handleTimeChange}
        />
        </Col>
        <Col md={3}>
        <ChatsContainer messages={this.props.video.messages.slice(0, this.state.messagesPointer)} emotes={this.props.emotes} />
        </Col>
        </Row>
      </div>
    );
  }
}

VideoContainer.propTypes = {
  video: React.PropTypes.shape({
    _id: React.PropTypes.string.isRequired,
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
    messages: React.PropTypes.array.isRequired
  }).isRequired,
  emotes: React.PropTypes.object.isRequired,
  username: React.PropTypes.string
};

export default VideoContainer;
