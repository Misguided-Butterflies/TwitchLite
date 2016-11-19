import React from 'react';
import Chat from '../Chat';

const ChatsContainer = (props) => {
  return (
    <div className='chats-container'>
      <h3>Chat</h3>
      {
        props.messages.map(message => (
          <Chat key={message.from + message.time} message={message} emotes={props.emotes}/>
        ))
      }
    </div>
  );
};

ChatsContainer.propTypes = {
  emotes: React.PropTypes.object.isRequired,
  messages: React.PropTypes.array.isRequired
};

export default ChatsContainer;
