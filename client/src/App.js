import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider } from './context/ChatContext';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <div className="App">
            <HomePage />
          </div>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App; 