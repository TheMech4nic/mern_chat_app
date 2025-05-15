import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      const userInfo = localStorage.getItem('userInfo');
      
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (username, password) => {
    try {
      const { data } = await axios.post('http://localhost:5556/api/users/register', {
        username,
        password
      });

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Login user
  const login = async (username, password) => {
    try {
      const { data } = await axios.post('http://localhost:5556/api/users/login', {
        username,
        password
      });

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      if (user) {
        await axios.post('http://localhost:5556/api/users/logout');
      }
      
      localStorage.removeItem('userInfo');
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 