import { io } from 'socket.io-client';

let socket;

const SOCKET_URL = 'https://parento-dcgi.onrender.com';

const socketOptions = {
  autoConnect: false, // Don't connect automatically
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['polling', 'websocket'], // Start with polling
  upgrade: true, // Allow transport upgrade
  withCredentials: true,
  path: '/socket.io/',
  auth: {
    token: localStorage.getItem('token')
  }
};

try {
  socket = io(SOCKET_URL, socketOptions);

  // Update auth token when it changes
  window.addEventListener('storage', (event) => {
    if (event.key === 'token') {
      socket.auth.token = event.newValue;
      if (socket.connected) {
        socket.disconnect().connect(); // Reconnect with new token
      }
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
    if (error.message === 'xhr poll error') {
      console.log('Retrying connection with polling transport');
      socket.io.opts.transports = ['polling'];
    }
  });

  socket.on('connect', () => {
    console.log('Socket connected successfully:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Reconnect if server disconnected
      setTimeout(() => {
        socket.connect();
      }, 1000);
    }
  });

  // Connect only if user is authenticated
  if (localStorage.getItem('token')) {
    socket.connect();
  }

} catch (error) {
  console.error('Socket initialization error:', error);
}

export { socket };