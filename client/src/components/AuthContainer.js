import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Chat App</h1>
        <p>Connect with friends in real-time</p>
      </div>
      
      {isLogin ? (
        <Login onToggleForm={toggleForm} />
      ) : (
        <Register onToggleForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthContainer; 