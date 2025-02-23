import { io } from 'socket.io-client';

let socket;

const SOCKET_URL = 'https://parento-dcgi.onrender.com';

const socketOptions = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['polling', 'websocket'], // Try polling first, then websocket
  withCredentials: true,
  forceNew: true,
};

try {
  socket = io(SOCKET_URL, socketOptions);

  socket.on('connect', () => {
    console.log('Socket connected successfully:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
    // Try to reconnect with polling if websocket fails
    if (socket.io.opts.transports.includes('websocket')) {
      console.log('Falling back to polling transport');
      socket.io.opts.transports = ['polling'];
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Reconnect if server disconnected
      socket.connect();
    }
  });

} catch (error) {
  console.error('Socket initialization error:', error);
}

export { socket };