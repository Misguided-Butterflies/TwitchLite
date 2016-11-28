import React from 'react';
import Chat from '../Chat';

const numberOfPixelsFromBottomBeforeCountingAsScrolledUp = 20;

/** ChatsContainer
 * this component represents a list of chat messages to display alongside a twitch embed video.
 * usage:
 * <ChatsContainer videoHeight=768 emotes={{Kappa: 25, ...}} messages={[{from: 'batman', time: 13251345345, text: 'lulz'}, ...]} />
 */
class ChatsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  scrollDown() {
    this.refs.container.scrollTop = this.refs.container.scrollHeight;
  }

  isScrolledDown() {
    return this.refs.container.scrollTop - this.refs.container.scrollHeight + this.clientHeight >= 0;
  }

  componentWillUpdate() {
    this.scrolledDown = this.isScrolledDown();
    console.log('client height: ', this.refs.container.clientHeight);
    console.log('scrollHeight: ', this.refs.container.scrollHeight);
    console.log('scrollTop: ', this.refs.container.scrollTop);
    console.log('scrolledDown: ', this.scrolledDown);
  }

  componentDidUpdate(oldProps) {
    // Scroll down only if we have new messages
    if (!oldProps.messages.length || (oldProps.messages.length !== this.props.messages.length && this.scrolledDown)) {
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
            <Chat key={message.from + message.time} message={message} emotes={this.props.emotes} />
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
