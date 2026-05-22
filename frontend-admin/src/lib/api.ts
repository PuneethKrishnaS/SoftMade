import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh / logout on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const res = await axios.post('http://localhost:8000/api/auth/refresh/', {
            refresh: refreshToken,
          });
          const newAccessToken = res.data.access;
          useAuthStore.getState().setTokens(newAccessToken, refreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
