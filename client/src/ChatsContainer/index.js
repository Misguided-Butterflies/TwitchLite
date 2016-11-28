import React from 'react';
import Chat from '../Chat';

/** ChatsContainer
 * this component represents a list of chat messages to display alongside a twitch embed video.
 * usage:
 * <ChatsContainer videoHeight=768 emotes={{Kappa: 25, ...}} messages={[{from: 'batman', time: 13251345345, text: 'lulz'}, ...]} />
 */
class ChatsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.scrollDown = this.scrollDown.bind(this);
  }

  scrollDown() {
    this.refs.container.scrollTop = this.refs.container.scrollHeight;
  }

  componentDidUpdate(oldProps) {
    // Scroll down only if we have new messages
    if (oldProps.messages.length !== this.props.messages.length) {
      this.scrollDown();
    }
  }

  render() {
    return (
      <div
        className='chats-container'
        ref='container'
        style={{height: this.props.videoHeight}}
      >
        {
          this.props.messages.map(message => (
            <Chat key={message.from + message.time + Math.random()} message={message} emotes={this.props.emotes} />
          ))
        }
      </div>
    );
  }

}

ChatsContainer.propTypes = {
  emotes: React.PropTypes.object.isRequired,
  messages: React.PropTypes.array.isRequired,
  videoHeight: React.PropTypes.number
};

export default ChatsContainer;
