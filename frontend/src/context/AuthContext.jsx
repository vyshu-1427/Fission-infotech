import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user has token and verify profile on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/profile');
        if (response.data?.success) {
          setUser(response.data.data);
        } else {
          // Token is invalid/expired
          logout();
        }
      } catch (error) {
        console.error('Failed to load profile on startup', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data?.success) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return { success: true };
      }
      // Fallback: 2xx but success:false (unexpected)
      return {
        success: false,
        message: response.data?.message || 'Registration failed. Please try again.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.success) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return { success: true };
      }
      // Fallback: 2xx but success:false (unexpected)
      return {
        success: false,
        message: response.data?.message || 'Login failed. Please check your credentials.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password.',
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update profile function
  const updateProfile = async (name, email, password) => {
    try {
      const payload = { name, email };
      if (password) payload.password = password;

      const response = await api.put('/auth/profile', payload);
      if (response.data?.success) {
        const { token, ...userData } = response.data.data;
        if (token) localStorage.setItem('token', token);
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile.',
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
