import React from 'react';
import Chat from '../Chat';

const ChatsContainer = ({messages}) => {
  return (
    <div className='chats-container'>
      <h3>Chat</h3>
      {
        messages.map(message => (
          <Chat key={message.from + message.time} message={message} />
        ))
      }
    </div>
  );
};

ChatsContainer.propTypes = {
  messages: React.PropTypes.array.isRequired
};

export default ChatsContainer;
