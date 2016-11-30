import React from 'react';
import utils from '../utils';

/** Chat
 * This component represents one chat message in a chat log associated with a twitch highlight.
 * usage:
 * <Chat message={{from: 'batman', time: 123987293, text: 'KappaRoss KappaPride'}} emotes={{Kappa: 25, ...}} />
 */
class Chat extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.replaceEmotes();
  }

  componentDidUpdate() {
    this.props.scrollDown();
  }

  replaceEmotes() {
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
  emotes: React.PropTypes.object.isRequired,
  scrollDown: React.PropTypes.func.isRequired
};

export default Chat;
