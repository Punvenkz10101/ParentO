import { io } from 'socket.io-client';
import { SOCKET_URL } from '../url';

const socketOptions = {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['polling', 'websocket'],
  upgrade: true,
  withCredentials: true,
  path: '/socket.io/',
  auth: {
    token: localStorage.getItem('token')
  }
};

export const socket = io(SOCKET_URL, socketOptions);

// Update auth token when it changes
window.addEventListener('storage', (event) => {
  if (event.key === 'token') {
    socket.auth.token = event.newValue;
    if (socket.connected) {
      socket.disconnect().connect();
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

// Connect only if user is authenticated
if (localStorage.getItem('token')) {
  socket.connect();
}

export default socket;