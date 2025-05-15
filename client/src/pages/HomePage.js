import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthContainer from '../components/AuthContainer';
import ChatInterface from '../components/ChatInterface';

const HomePage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return user ? <ChatInterface /> : <AuthContainer />;
};

export default HomePage; 