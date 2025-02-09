const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
require('dotenv').config();

let io;

const initializeSocket = (socketIO) => {
  io = socketIO;

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    // Join event room
    socket.on('joinEvent', ({ eventId }) => {
      socket.join(`event:${eventId}`);
      const roomSize = io.sockets.adapter.rooms.get(`event:${eventId}`)?.size || 0;
      io.to(`event:${eventId}`).emit('viewerCount', { count: roomSize });
    });

    // Leave event room
    socket.on('leaveEvent', ({ eventId }) => {
      socket.leave(`event:${eventId}`);
      const roomSize = io.sockets.adapter.rooms.get(`event:${eventId}`)?.size || 0;
      io.to(`event:${eventId}`).emit('viewerCount', { count: roomSize });
    });

    socket.on('eventAttended', async ({ eventId, userId, type }) => {
      try {
        // Get updated event data
        const event = await Event.findById(eventId).populate('attendees', 'name email createdAt');
        
        if (!event) {
          console.error('Event not found:', eventId);
          return;
        }
        
        // Broadcast to all users in the event room AND to all connected clients
        const updateData = {
          type: 'newAttendee',
          eventId,
          attendees: event.attendees,
          message: type === 'join' 
            ? `A new attendee has joined the event!`
            : `An attendee has left the event`
        };

        // Emit to event room for detailed updates
        io.to(`event:${eventId}`).emit('eventUpdated', updateData);
        
        // Also emit to all clients for list updates
        io.emit('eventUpdated', updateData);
      } catch (error) {
        console.error('Error handling event attendance:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
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