import React from 'react';
import utils from '../utils';

class Chat extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.refs.text.innerHTML =
      this.props.message.text
      .split(' ')
      .map(word =>
        this.props.emotes[word]
        ? `<img src="${utils.getTwitchEmoteImageUrl(this.props.emotes[word])}" title=${word} />`
        : word
      ).join(' ');
  }

  render() {
    return (
      <div className='chat'>
        <span className='chat-from'>{this.props.message.from}: </span>
        <span className='chat-text' ref='text'>{this.props.message.text}</span>
      </div>
    );
  }
}

Chat.propTypes = {
  message: React.PropTypes.shape({
    time: React.PropTypes.number.isRequired,
    text: React.PropTypes.string.isRequired,
    from: React.PropTypes.string.isRequired
  }).isRequired,
  emotes: React.PropTypes.object.isRequired
};

export default Chat;
