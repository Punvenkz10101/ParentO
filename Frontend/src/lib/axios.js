import axios from 'axios';
import { API_URL } from '../url';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      toast.error(message);
      
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.clear();
        window.location.href = '/';
      }
    } else if (error.request) {
      // Request was made but no response
      console.error('No response received:', error.request);
      toast.error('Unable to connect to server. Please try again.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      toast.error('An error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default api;