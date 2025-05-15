import React from 'react';
import Header from './Header';
import UserList from './UserList';
import ChatWindow from './ChatWindow';

const ChatInterface = () => {
  return (
    <div className="chat-interface">
      <Header />
      <div className="chat-container">
        <UserList />
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatInterface; 