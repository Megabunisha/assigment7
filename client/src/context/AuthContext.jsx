import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('pulse_token'));
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Load current user profile on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('pulse_token');
      if (storedToken) {
        try {
          const data = await authService.getMe();
          if (data && data.user) {
            setUser(data.user);
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          localStorage.removeItem('pulse_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (identifier, password) => {
    try {
      setIsLoading(true);
      const data = await authService.login({
        emailOrUsername: identifier,
        password
      });

      if (data && data.token) {
        localStorage.setItem('pulse_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast(data.message || `Welcome back, ${data.user.name}!`, 'success');
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const data = await authService.register(userData);

      if (data && data.token) {
        localStorage.setItem('pulse_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast('Registration successful! Welcome aboard 🎉', 'success');
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Demo 1-Click Login for Evaluators & Testing
  const demoLogin = async (username = 'alex_dev') => {
    return await login(username, 'password123');
  };

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('pulse_token');
    setToken(null);
    setUser(null);
    authService.logout();
    showToast('You have been logged out securely.', 'info');
  }, [showToast]);

  // Update local user state after profile edits
  const updateUserData = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        demoLogin,
        logout,
        updateUserData
      }}
    >
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
