import React from 'react';
import Chat from '../Chat';

const ChatsContainer = ({messages}) => {
  return (
    <div className='chats-container'>
      {
        messages.map(message => (
          <Chat message={message} />
        ))
      }
    </div>
  );
};

ChatsContainer.propTypes = {
  messages: React.PropTypes.array.isRequired
};

export default ChatsContainer;
