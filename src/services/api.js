import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userdata');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

// User & Social Graph Services
export const userAPI = {
  getProfile: async (id = 'me') => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },
  searchUsers: async (query = '') => {
    const res = await api.get(`/users?q=${encodeURIComponent(query)}`);
    return res.data;
  },
  follow: async (userId) => {
    const res = await api.post(`/users/${userId}/follow`);
    return res.data;
  },
  unfollow: async (userId) => {
    const res = await api.post(`/users/${userId}/unfollow`);
    return res.data;
  },
  getSuggestions: async () => {
    const res = await api.get('/users/suggestions');
    return res.data;
  },
};

// Microblogging Post Services
export const postAPI = {
  getAllPosts: async (feedType = 'for-you', tag = null, query = null) => {
    let url = `/posts?feed=${feedType}`;
    if (tag) url += `&tag=${encodeURIComponent(tag)}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    const res = await api.get(url);
    return res.data;
  },
  createPost: async (postData) => {
    const res = await api.post('/posts', postData);
    return res.data;
  },
  reactToPost: async (postId, type) => {
    const res = await api.post(`/posts/${postId}/react`, { type });
    return res.data;
  },
  repost: async (postId) => {
    const res = await api.post(`/posts/${postId}/repost`);
    return res.data;
  },
  bookmark: async (postId) => {
    const res = await api.post(`/posts/${postId}/bookmark`);
    return res.data;
  },
  pin: async (postId) => {
    const res = await api.post(`/posts/${postId}/pin`);
    return res.data;
  },
  recordView: async (postId) => {
    const res = await api.post(`/posts/${postId}/view`);
    return res.data;
  },
  addComment: async (postId, content) => {
    const res = await api.post(`/posts/${postId}/comment`, { content });
    return res.data;
  },
  deletePost: async (postId) => {
    const res = await api.delete(`/posts/${postId}`);
    return res.data;
  },
  getTrending: async () => {
    const res = await api.get('/posts/trending');
    return res.data;
  },
};

// Messaging Services
export const messageAPI = {
  getConversations: async () => {
    const res = await api.get('/messages/conversations');
    return res.data;
  },
  getMessages: async (userId) => {
    const res = await api.get(`/messages/${userId}`);
    return res.data;
  },
  sendMessage: async (receiverId, message) => {
    const res = await api.post('/messages', { receiver_id: receiverId, message });
    return res.data;
  },
};

// Upload Services
export const uploadAPI = {
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export default api;
