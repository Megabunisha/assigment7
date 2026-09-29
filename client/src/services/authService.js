import api from './api';

export const authService = {
  // Register new account
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login existing account
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current authenticated user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout session
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  }
};
