import { io } from 'socket.io-client';
import { API_URL } from '../api/config';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(API_URL, {
        withCredentials: true,
        transports: ['websocket'],
        auth: {
          token: localStorage.getItem('token')
        }
      });

      // Add connection event handlers
      this.socket.on('connect', () => {
        console.log('Socket connected');
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