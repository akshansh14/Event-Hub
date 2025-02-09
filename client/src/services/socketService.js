import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:5000', {
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
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

  // Event room methods
  joinEventRoom(eventId) {
    if (this.socket) {
      this.socket.emit('joinEvent', eventId);
    }
  }

  leaveEventRoom(eventId) {
    if (this.socket) {
      this.socket.emit('leaveEvent', eventId);
    }
  }
}

export default new SocketService(); 