// Development URLs (localhost)
const DEVELOPMENT_API_URL = 'http://localhost:5000';
const DEVELOPMENT_SOCKET_URL = 'ws://localhost:5000';

// Production URLs (Render)
const PRODUCTION_API_URL = 'https://parento-dcgi.onrender.com';
const PRODUCTION_SOCKET_URL = 'wss://parento-dcgi.onrender.com';

// Check if we're in development mode
const isDevelopment = import.meta.env.MODE === 'development';

// Export the appropriate URLs based on environment
export const API_URL = isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;
export const SOCKET_URL = isDevelopment ? DEVELOPMENT_SOCKET_URL : PRODUCTION_SOCKET_URL;

// Export the environment mode for use in other parts of the application
export const IS_DEVELOPMENT = isDevelopment;