import React, { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import MessageForm from './MessageForm';

const ChatWindow = () => {
  const { selectedUser, messages, loading } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { onlineUsers, typingUsers } = useContext(SocketContext);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Check if selected user is typing
  const isUserTyping = selectedUser ? typingUsers[selectedUser._id] : false;
  // Check if selected user is online
  const isUserOnline = selectedUser ? onlineUsers[selectedUser._id] : false;

  if (!selectedUser) {
    return (
      <div className="chat-window empty-chat">
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{selectedUser.username}</h3>
        <div className="user-status">
          {isUserOnline ? (
            <span className="status online">Online</span>
          ) : (
            <span className="status offline">Offline</span>
          )}
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="messages">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message ${msg.sender._id === user._id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
                {isUserTyping && (
                  <div className="typing-indicator">
                    <p>{selectedUser.username} is typing...</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </>
        )}
      </div>

      <MessageForm recipientId={selectedUser._id} />
    </div>
  );
};

export default ChatWindow; 