import React from 'react';
import Chat from '../Chat';

const numberOfPixelsFromBottomBeforeCountingAsScrolledUp = 20;

/** ChatsContainer
 * Represents a list of chat messages to display alongside a twitch embed video.
 * usage:
 * <ChatsContainer videoHeight=768 emotes={{Kappa: 25, ...}} messages={[{from: 'batman', time: 13251345345, text: 'lulz'}, ...]} />
 */
class ChatsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.scrollDown = this.scrollDown.bind(this);
  }

  scrollDown() {
    if (this.scrolledDown) {
      this.refs.container.scrollTop = this.refs.container.scrollHeight;
    }
  }

  isScrolledDown() {
    return this.refs.container.scrollTop + this.refs.container.clientHeight >= this.refs.container.scrollHeight - numberOfPixelsFromBottomBeforeCountingAsScrolledUp;
  }

  componentWillUpdate() {
    this.scrolledDown = this.isScrolledDown();
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
            <Chat key={message.from + message.time} message={message} emotes={this.props.emotes} scrollDown={this.scrollDown} />
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
