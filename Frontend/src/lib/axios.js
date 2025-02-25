import axios from 'axios';
import { toast } from 'react-hot-toast';

const BASE_URL = 'https://parento-dcgi.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add /api prefix to all requests that don't start with http or /api
  if (!config.url.startsWith('http') && !config.url.startsWith('/api')) {
    config.url = `/api${config.url}`;
  }

  // Log the full URL for debugging
  const fullUrl = `${BASE_URL}${config.url}`;
  console.log('Making request to:', fullUrl);

  return config;
}, error => Promise.reject(error));

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    console.log('Failed request URL:', `${BASE_URL}${error.config?.url}`);

    if (error.response) {
      switch (error.response.status) {
        case 404:
          console.log('Resource not found at:', `${BASE_URL}${error.config?.url}`);
          toast.error('Service unavailable. Please try again later.');
          break;
        case 401:
          toast.error('Invalid credentials. Please try again.');
          break;
        default:
          toast.error(error.response.data?.message || 'An error occurred');
      }
    } else if (error.request) {
      toast.error('Unable to connect to server. Please check your internet connection.');
    } else {
      toast.error('An unexpected error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default api;