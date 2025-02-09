import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
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
}

export default new SocketService(); 