import { io } from 'socket.io-client';
import { SOCKET_URL } from '../url';
import { toast } from 'react-hot-toast';

const socketOptions = {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket', 'polling'],
  upgrade: true,
  withCredentials: true,
  path: '/socket.io/',
  auth: {
    token: localStorage.getItem('token')
  }
};

export const socket = io(SOCKET_URL, socketOptions);

// Connection event handlers
socket.on('connect', () => {
  console.log('Socket connected successfully');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
  if (error.message === 'xhr poll error') {
    // Fallback to polling if websocket fails
    socket.io.opts.transports = ['polling'];
  }
  // Show error message to user
  toast.error('Connection error. Retrying...');
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
  if (reason === 'io server disconnect') {
    // Server disconnected the client
    socket.connect();
  }
});

// Reconnection event handlers
socket.io.on('reconnect', (attempt) => {
  console.log('Socket reconnected after', attempt, 'attempts');
  toast.success('Reconnected to server');
});

socket.io.on('reconnect_attempt', (attempt) => {
  console.log('Socket attempting to reconnect:', attempt);
});

socket.io.on('reconnect_error', (error) => {
  console.error('Socket reconnection error:', error);
});

socket.io.on('reconnect_failed', () => {
  console.error('Socket reconnection failed');
  toast.error('Failed to reconnect. Please refresh the page.');
});

// Update auth token when it changes
window.addEventListener('storage', (event) => {
  if (event.key === 'token') {
    socket.auth.token = event.newValue;
    if (socket.connected) {
      socket.disconnect().connect();
    }
  }
});

// Connect only if user is authenticated
if (localStorage.getItem('token')) {
  socket.connect();
}

// Add ping/pong to check connection health
setInterval(() => {
  if (socket.connected) {
    const start = Date.now();
    socket.volatile.emit('ping', () => {
      const latency = Date.now() - start;
      console.log('Socket latency:', latency + 'ms');
    });
  }
}, 25000);

export default socket;