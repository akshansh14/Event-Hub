import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_FRONTEND_URL?.replace(/\/$/, '');

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      console.log('Connecting to socket:', BASE_URL);
      this.socket = io(BASE_URL, {
        withCredentials: true,
        transports: ['websocket'],
        path: '/socket.io',
        auth: {
          token: localStorage.getItem('token')
        }
      });

      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinEventRoom(eventId) {
    if (this.socket) {
      this.socket.emit('joinEvent', { eventId });
    }
  }

  leaveEventRoom(eventId) {
    if (this.socket) {
      this.socket.emit('leaveEvent', { eventId });
    }
  }

  // Add method to handle reconnection
  reconnect() {
    this.disconnect();
    return this.connect();
  }
}

export default new SocketService(); 