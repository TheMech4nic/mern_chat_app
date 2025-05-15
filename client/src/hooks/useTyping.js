import { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';

const useTyping = (recipientId) => {
  const [isTyping, setIsTyping] = useState(false);
  const { sendTypingStatus, typingUsers } = useContext(SocketContext);
  const timerRef = useRef(null);

  // Check if recipient is typing
  const isRecipientTyping = recipientId ? typingUsers[recipientId] : false;

  // Set typing status with debounce
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(recipientId, true);
    }

    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer to stop typing indicator after 1.5 seconds
    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(recipientId, false);
    }, 1500);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (isTyping) {
        sendTypingStatus(recipientId, false);
      }
    };
  }, [isTyping, recipientId, sendTypingStatus]);

  return {
    isRecipientTyping,
    handleTyping
  };
};

export default useTyping; 