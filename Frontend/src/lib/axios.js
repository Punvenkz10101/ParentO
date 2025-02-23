import axios from 'axios';
import { API_URL } from '../url';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Add timeout
  timeout: 15000,
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
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
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
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear storage and redirect to login
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/';
          break;
        case 404:
          // Not Found
          console.error('Resource not found:', originalRequest.url);
          toast.error('Resource not found. Please try again later.');
          break;
        case 403:
          // Forbidden
          toast.error('You do not have permission to perform this action');
          break;
        case 500:
          // Server Error
          toast.error('Server error. Please try again later.');
          break;
        default:
          // Other errors
          toast.error(error.response.data?.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.request);
      toast.error('Unable to connect to server. Please check your internet connection.');
    } else {
      // Other errors
      console.error('Error:', error.message);
      toast.error('An unexpected error occurred. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default api;