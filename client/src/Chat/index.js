import React from 'react';

const Chat = ({message}) => {
  return (
    <div className='chat'>
      <span className='chat-from'>{message.from}</span>
      <span className='chat-text'>{message.text}</span>
    </div>
  );
};

Chat.propTypes = {
  message: React.PropTypes.shape({
    time: React.PropTypes.number.isRequired,
    text: React.PropTypes.string.isRequired,
    from: React.PropTypes.string.isRequired
  }).isRequired
};

export default Chat;
