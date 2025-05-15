import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const { user } = useContext(AuthContext);

  // Initialize socket connection when user logs in
  useEffect(() => {
    let socketInstance;

    if (user) {
      // Connect to socket server
      socketInstance = io('http://localhost:5556', {
        auth: {
          token: user.token
        }
      });

      // Set socket instance
      setSocket(socketInstance);
      
      // Handle user status updates
      socketInstance.on('userStatus', ({ userId, status }) => {
        setOnlineUsers(prev => ({
          ...prev,
          [userId]: status
        }));
      });

      // Handle typing status updates
      socketInstance.on('typing', ({ senderId, isTyping }) => {
        setTypingUsers(prev => ({
          ...prev,
          [senderId]: isTyping
        }));
      });
    }

    // Cleanup on unmount or user logout
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user]);

  // Send typing status
  const sendTypingStatus = (recipientId, isTyping) => {
    if (socket) {
      socket.emit('typing', { recipientId, isTyping });
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      onlineUsers, 
      typingUsers, 
      sendTypingStatus 
    }}>
      {children}
    </SocketContext.Provider>
  );
};