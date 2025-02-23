import { io } from 'socket.io-client';
import { SOCKET_URL, IS_DEVELOPMENT } from '../url';
import { toast } from 'react-hot-toast';

const socketOptions = {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: IS_DEVELOPMENT ? Infinity : 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: IS_DEVELOPMENT ? 30000 : 20000,
  transports: ['websocket', 'polling'],
  upgrade: true,
  withCredentials: true,
  path: '/socket.io/',
  auth: {
    token: localStorage.getItem('token')
  }
};

export const socket = io(SOCKET_URL, socketOptions);

// Development logging
if (IS_DEVELOPMENT) {
  socket.onAny((event, ...args) => {
    console.log('Socket Event:', event, args);
  });
}

// Connection event handlers
socket.on('connect', () => {
  if (IS_DEVELOPMENT) {
    console.log('Socket connected successfully');
  }
});

socket.on('connect_error', (error) => {
  if (IS_DEVELOPMENT) {
    console.error('Socket connection error:', error);
  }
  
  if (error.message === 'xhr poll error') {
    socket.io.opts.transports = ['polling'];
  }
  
  toast.error('Connection error. Retrying...');
});

socket.on('disconnect', (reason) => {
  if (IS_DEVELOPMENT) {
    console.log('Socket disconnected:', reason);
  }
  
  if (reason === 'io server disconnect') {
    socket.connect();
  }
});

// Reconnection handlers
socket.io.on('reconnect', (attempt) => {
  if (IS_DEVELOPMENT) {
    console.log('Socket reconnected after', attempt, 'attempts');
  }
  toast.success('Reconnected to server');
});

socket.io.on('reconnect_error', (error) => {
  if (IS_DEVELOPMENT) {
    console.error('Socket reconnection error:', error);
  }
});

socket.io.on('reconnect_failed', () => {
  if (IS_DEVELOPMENT) {
    console.error('Socket reconnection failed');
  }
  toast.error('Failed to reconnect. Please refresh the page.');
});

// Token update handler
window.addEventListener('storage', (event) => {
  if (event.key === 'token') {
    socket.auth.token = event.newValue;
    if (socket.connected) {
      socket.disconnect().connect();
    }
  }
});

// Auto-connect if authenticated
if (localStorage.getItem('token')) {
  socket.connect();
}

// Health check (only in production)
if (!IS_DEVELOPMENT) {
  setInterval(() => {
    if (socket.connected) {
      socket.volatile.emit('ping');
    }
  }, 25000);
}

export default socket;