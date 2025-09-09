import React, { createContext, useState, useEffect, useContext } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      const userData = JSON.parse(storedUser);
      // Extract role information if available
      const userWithRole = userData.role ? userData : { ...userData, role: 'user' };
      setCurrentUser(userWithRole);
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await ApiService.login({ username, password });
      
      // Parse JWT token to get user role
      const parseJwt = (token) => {
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          return null;
        }
      };
      
      const decodedToken = parseJwt(response.token);
      const role = decodedToken?.role || 'VOLUNTEER';
      const userId = decodedToken?.userId;
      
      const userData = { username, role, userId };
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(response.token);
      setCurrentUser(userData);
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await ApiService.register(userData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;