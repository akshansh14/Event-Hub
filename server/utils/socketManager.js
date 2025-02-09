const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join event room
    socket.on('joinEvent', (eventId) => {
      socket.join(`event:${eventId}`);
      const roomSize = io.sockets.adapter.rooms.get(`event:${eventId}`)?.size || 0;
      io.to(`event:${eventId}`).emit('viewerCount', { count: roomSize });
    });

    // Leave event room
    socket.on('leaveEvent', (eventId) => {
      socket.leave(`event:${eventId}`);
      const roomSize = io.sockets.adapter.rooms.get(`event:${eventId}`)?.size || 0;
      io.to(`event:${eventId}`).emit('viewerCount', { count: roomSize });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO }; 