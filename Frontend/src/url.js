const DEVELOPMENT_API_URL = 'http://localhost:5000';
const PRODUCTION_API_URL = '';  // Empty for relative paths

export const API_URL = import.meta.env.PROD ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;

// Socket.IO URL
export const SOCKET_URL = import.meta.env.PROD ? 'wss://parento-dcgi.onrender.com' : 'ws://localhost:5000';