import { io } from 'socket.io-client';

let socket;

try {
  socket = io('http://localhost:5000', {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    withCredentials: true,
    timeout: 10000
  });
} catch (error) {
  console.error('Socket initialization error:', error);
}

// Add error handling for socket events
if (socket) {
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
}

export { socket }; 