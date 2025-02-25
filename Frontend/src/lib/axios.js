import axios from 'axios';
import { API_URL, IS_DEVELOPMENT } from '../url';
import { toast } from 'react-hot-toast';

const instance = axios.create({
  baseURL: 'https://parento-dcgi.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (IS_DEVELOPMENT) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        data: config.data
      });
    }

    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      };
    }

    // Don't modify URLs that already have the full path
    if (!config.url.startsWith('http')) {
      // Remove the /api prefix from the URLs if it exists
      config.url = config.url.replace(/^\/api/, '');
    }
    return config;
  },
  (error) => {
    if (IS_DEVELOPMENT) {
      console.error('Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }

    if (error.response) {
      const isLoginAttempt = error.config.url.includes('/auth/login') || 
                            error.config.url.includes('/teacher/login') ||
                            error.config.url.includes('/parent/login');

      switch (error.response.status) {
        case 401:
          if (isLoginAttempt) {
            toast.error('Account not found. Please check your credentials.');
          } else {
            toast.error('Session expired. Please login again.');
            localStorage.clear();
            window.location.href = '/';
          }
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 403:
          toast.error('Access denied');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(error.response.data?.message || 'An error occurred');
      }
    } else if (error.request) {
      toast.error('Unable to connect to server');
    } else {
      toast.error('An error occurred');
    }

    return Promise.reject(error);
  }
);

export default instance;