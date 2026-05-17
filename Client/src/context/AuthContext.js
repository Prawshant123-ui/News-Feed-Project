import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await loginAdmin({ username, password });
      const { token: newToken } = res.data;
      localStorage.setItem('adminToken', newToken);
      setToken(newToken);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
