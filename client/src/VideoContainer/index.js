import React from 'react';
import Video from '../Video';
import ChatsContainer from '../ChatsContainer';
import axios from 'axios';
import {Row, Col} from 'react-bootstrap';
import InlineSVG from 'svg-inline-react';

import upvoteSVG from '../icons/upvote.svg';
import downvoteSVG from '../icons/downvote.svg';

/** VideoComponent
 * this is a component that wraps <Video> and handles all other UI and logic
 * for rendering a <Video>
 * usage:
 * <VideoContainer video={video} emotes={emotes} username={username}/>
 */
class VideoContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      voteCount: this.calculateVotes(props.video.votes),
      userVote: this.getUserVote(props.username, props.video.votes),
      // messagesPointer is the index of the message that should
      // have been displayed at any given point while the video plays
      messagesPointer: 0,
      // null indicates there is no custom height to set yet
      videoHeight: null,
      messages: []
    };

    this.calculateVotes = this.calculateVotes.bind(this);
    this.sendVote = this.sendVote.bind(this);
    this.updateUserVote = this.updateUserVote.bind(this);
    this.getUserVote = this.getUserVote.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.fetchChat = this.fetchChat.bind(this);
    this.handleHeightCalculation = this.handleHeightCalculation.bind(this);
  }

  handleHeightCalculation(videoHeight) {
    this.setState({
      videoHeight
    });
  }

  getUserVote(username, votes) {
    if (votes.hasOwnProperty(username)) {
      return votes[username];
    }

    return 0;
  }

  handleTimeChange(msSinceHighlightStart) {
    var newPointer = this.state.messagesPointer;

    while (this.state.messages[newPointer] &&
      this.state.messages[newPointer].time <= this.props.video.highlightStart + msSinceHighlightStart) {
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

  fetchChat() {
    //gets chat messages via axios, currently feeds placeholder stuff
    axios.get('/highlights/chat/?id=582f59c0b2a0c2057664baf7')
    .then(response => {
      this.setState({messages: response.data[0].messages, messagesPointer: 0});
    });
  }
  
  
  render() {
    let upvoteClass = this.state.userVote === 1 ? 'video-button upvote active' : 'video-button upvote';
    let downvoteClass = this.state.userVote === -1 ? 'video-button downvote active' : 'video-button downvote';


    return (
      <div className='video-container'>
        <div className='video-top'>
          <h2>{this.props.video.streamTitle}</h2>
          <h3 className='video-subtitle'>{this.props.video.channelName} playing {this.props.video.game}</h3>
        </div>
        <Video
          video={{
            id: this.props.video.vodId,
            preview: this.props.video.preview,
            start: Math.floor((this.props.video.highlightStart - this.props.video.streamStart) / 1000),
            duration: Math.floor((this.props.video.highlightEnd - this.props.video.highlightStart) / 1000),
            fetchChat: this.fetchChat
          }}
          handleTimeChange={this.handleTimeChange}
          handleHeightCalculation={this.handleHeightCalculation}
        />
        <div className='video-buttons'>
          {
            this.props.username ?
            (
              <button
              onClick={this.updateUserVote.bind(this, 1)}
              className={upvoteClass}
              >
              <InlineSVG src={upvoteSVG} />
              </button>
            ) :
            null
          }
          <div className='video-button vote-count'>
            <span>{this.state.voteCount}</span>
          </div>
          {
            this.props.username ?
            (
              <button
              onClick={this.updateUserVote.bind(this, -1)}
              className={downvoteClass}
              >
              <InlineSVG src={downvoteSVG} />
              </button>
            ) :
            null
          }
        </div>
        <ChatsContainer
          messages={this.props.video.messages.slice(0, this.state.messagesPointer)}
          emotes={this.props.emotes}
          videoHeight={this.state.videoHeight}
        />

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
