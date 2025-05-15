import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (user) {
        try {
          const { data } = await axios.get('http://localhost:5556/api/users');
          setUsers(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [user]);

  // Listen for incoming private messages
  useEffect(() => {
    if (socket) {
      socket.on('privateMessage', ({ senderId, message }) => {
        // Add message to state if it's from the selected user
        if (selectedUser && selectedUser._id === senderId) {
          setMessages(prev => [...prev, {
            sender: senderId,
            recipient: user._id,
            content: message,
            createdAt: new Date().toISOString()
          }]);
        } 
      });
    }

    return () => {
      if (socket) {
        socket.off('privateMessage');
      }
    };
  }, [socket, selectedUser, user]);

  // Fetch messages when selecting a user
  const selectUser = async (userId) => {
    try {
      setLoading(true);
      const selected = users.find(u => u._id === userId);
      setSelectedUser(selected);

      if (selected) {
        const { data } = await axios.get(`http://localhost:5556/api/messages/${userId}`);
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (content) => {
    if (!selectedUser || !content.trim()) return;

    try {
      const { data } = await axios.post('http://localhost:5556/api/messages', {
        recipientId: selectedUser._id,
        content
      });

      // Add message to state
      setMessages(prev => [...prev, data]);

      // Send via socket for real-time delivery
      if (socket) {
        socket.emit('privateMessage', {
          recipientId: selectedUser._id,
          message: content
        });
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  return (
    <ChatContext.Provider value={{
      users,
      selectedUser,
      messages,
      loading,
      selectUser,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
}; 