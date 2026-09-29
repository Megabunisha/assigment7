import api from './api';

export const userService = {
  // Fetch user profile by username
  getUserProfile: async (username) => {
    const response = await api.get(`/users/profile/${username}`);
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Follow or unfollow user
  followUnfollowUser: async (id) => {
    const response = await api.put(`/users/${id}/follow`);
    return response.data;
  },

  // Get suggested users to follow
  getSuggestedUsers: async () => {
    const response = await api.get('/users/suggested');
    return response.data;
  }
};
