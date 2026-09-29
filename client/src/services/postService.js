import api from './api';

export const postService = {
  // Fetch posts with optional query params (search, category, tag, feed)
  getAllPosts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `/posts?${query}` : '/posts';
    const response = await api.get(url);
    return response.data;
  },

  // Fetch single post
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Edit / update post
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Like or unlike post
  toggleLike: async (id) => {
    const response = await api.put(`/posts/${id}/like`);
    return response.data;
  },

  // Add comment
  addComment: async (id, text) => {
    const response = await api.post(`/posts/${id}/comments`, { text });
    return response.data;
  },

  // Delete comment
  deleteComment: async (id, commentId) => {
    const response = await api.delete(`/posts/${id}/comments/${commentId}`);
    return response.data;
  }
};
