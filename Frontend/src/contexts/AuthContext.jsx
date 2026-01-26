import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';
import { getDemoCredentials, isDemoEnabled } from '../config/demo.config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const { showToast } = useToast();

  useEffect(() => {
    if (token && user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token, user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      if (isDemoEnabled()) {
        const demoData = getDemoCredentials(email, password);
        if (demoData) {
          setToken(demoData.token);
          setUser(demoData.user);
          setIsAuthenticated(true);
          showToast('success', '🎭 Demo login successful!');
          return { success: true, user: demoData.user };
        }
      }

      const response = await authAPI.login(email, password);
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      showToast('success', 'Login successful!');
      return { success: true, user: response.user };
    } catch (error) {
      const message = error.message || 'Login failed';
      showToast('error', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setToken, setUser, showToast]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    showToast('info', 'Logged out successfully');
  }, [setToken, setUser, showToast]);

  const updateUser = useCallback((userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  }, [setUser]);

  const updateAuthState = useCallback((newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
    setIsAuthenticated(true);
  }, [setUser, setToken]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      loading,
      login,
      logout,
      updateUser,
      updateAuthState,
    }),
    [user, token, isAuthenticated, loading, login, logout, updateUser, updateAuthState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
