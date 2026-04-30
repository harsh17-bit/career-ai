import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  googleAuth: (data) => api.post('/auth/google', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyResetOtp: (data) => api.post('/auth/verify-reset-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Career API
export const careerAPI = {
  getRecommendations: (data) => api.post('/career/recommend', data),
};

// Roadmap API
export const roadmapAPI = {
  generate: (data) => api.post('/roadmap/generate', data),
  getUserRoadmaps: () => api.get('/roadmap/me'),
  toggleMilestone: (data) => api.put('/roadmap/milestone', data),
};

// Chat API
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/send', data),
  getHistory: () => api.get('/chat/history'),
};

export default api;
