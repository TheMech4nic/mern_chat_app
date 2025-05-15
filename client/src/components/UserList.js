import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { SocketContext } from '../context/SocketContext';

const UserList = () => {
  const { users, selectedUser, selectUser } = useContext(ChatContext);
  const { onlineUsers } = useContext(SocketContext);

  return (
    <div className="user-list">
      <h2>Available Users</h2>
      {users.length === 0 ? (
        <p>No users available</p>
      ) : (
        <ul>
          {users.map(user => (
            <li 
              key={user._id} 
              className={`user-item ${selectedUser?._id === user._id ? 'selected' : ''}`}
              onClick={() => selectUser(user._id)}
            >
              <div className="user-info">
                <span className="username">{user.username}</span>
                <span className={`status ${onlineUsers[user._id] ? 'online' : 'offline'}`}>
                  {onlineUsers[user._id] ? 'online' : 'offline'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList; 