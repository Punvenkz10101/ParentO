import { io } from 'socket.io-client';

// Create socket with proper configuration
export const socket = io('http://localhost:5000', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
  withCredentials: true
}); 