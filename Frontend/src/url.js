const DEVELOPMENT_API_URL = 'http://localhost:5000';
const PRODUCTION_API_URL = 'https://parento-dcgi.onrender.com';

export const API_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;

// Socket.IO URL (same as API URL)
export const SOCKET_URL = API_URL; 