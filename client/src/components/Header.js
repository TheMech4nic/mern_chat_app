import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="app-header">
      <div className="logo">
        <h1>Chat App</h1>
      </div>
      {user && (
        <div className="user-controls">
          <span className="welcome-text">Welcome, {user.username}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header; 