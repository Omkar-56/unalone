import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
  try {
    const response = await API.get("/auth/me");
    setUser(response.data.user);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  } catch (error) {
    // Try refresh once
    try {
      await API.post("/auth/refresh");
      const retryResponse = await API.get("/auth/me");

      setUser(retryResponse.data.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(retryResponse.data.user));
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
    }
  } finally {
    setLoading(false);
  }
};


  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      // Token is automatically stored in HTTP-only cookie by backend
      // We just store user info in state and localStorage
      setUser(response.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      
      // Token is automatically stored in HTTP-only cookie by backend
      setUser(response.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
