import React, { useState, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import useTyping from '../hooks/useTyping';

const MessageForm = ({ recipientId }) => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useContext(ChatContext);
  const { handleTyping } = useTyping(recipientId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (message.trim()) {
      const success = await sendMessage(message);
      if (success) {
        setMessage('');
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type a message..."
        className="message-input"
      />
      <button type="submit" className="send-button" disabled={!message.trim()}>
        Send
      </button>
    </form>
  );
};

export default MessageForm; 