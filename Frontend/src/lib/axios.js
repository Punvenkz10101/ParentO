import axios from 'axios';
import { API_URL, IS_DEVELOPMENT } from '../url';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: IS_DEVELOPMENT ? 30000 : 15000, // Longer timeout in development
  // Add retry logic
  retry: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // time interval between retries
  }
});

// Request interceptor
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (IS_DEVELOPMENT) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  async (error) => {
    // Log errors in development
    if (IS_DEVELOPMENT) {
      console.error('Response Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data
      });
    }

    const originalRequest = error.config;

    // Retry failed requests (except for 401 and 404)
    if (error.response && ![401, 404].includes(error.response.status) && originalRequest._retry !== true) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount <= originalRequest.retry) {
        // Wait for the retry delay
        await new Promise(resolve => 
          setTimeout(resolve, originalRequest.retryDelay(originalRequest._retryCount))
        );
        return api(originalRequest);
      }
    }

    // Handle specific error cases
    if (error.response) {
      // Check if the error is from a login attempt
      const isLoginAttempt = error.config.url.includes('/auth/login') || 
                            error.config.url.includes('/auth/teacher/login') ||
                            error.config.url.includes('/auth/parent/login');

      switch (error.response.status) {
        case 401:
          if (isLoginAttempt) {
            // For login attempts, show "Account not found" message
            toast.error('Account not found. Please check your credentials.');
          } else {
            // For other 401 errors (like expired sessions)
            toast.error('Session expired. Please login again.');
            localStorage.clear();
            window.location.href = '/';
          }
          break;
        case 404:
          if (isLoginAttempt) {
            toast.error('Account not found. Please check your credentials.');
          } else {
            toast.error('Resource not found');
          }
          break;
        case 403:
          toast.error('Access denied');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          // Check for specific error messages from the backend
          if (error.response.data?.message?.toLowerCase().includes('not found')) {
            toast.error('Account not found. Please check your credentials.');
          } else {
            toast.error(error.response.data?.message || 'An error occurred');
          }
      }
    } else if (error.request) {
      toast.error('Unable to connect to server');
    } else {
      toast.error('An error occurred');
    }

    return Promise.reject(error);
  }
);

export default api;