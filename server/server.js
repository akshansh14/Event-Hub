const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { initializeSocket } = require('./utils/socketManager');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: "https://event-hub-bay-six.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
  preflightContinue: true,
  optionsSuccessStatus: 204
};

// Apply CORS before routes
app.use(cors(corsOptions));
app.use(express.json());

// Add request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Move test route before other routes
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Add a root route for basic health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Server is running'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Add better error logging
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: err.stack
  });
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.path
  });
});

// Add 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.path);
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "https://event-hub-bay-six.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }
});

initializeSocket(io);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS origin:', corsOptions.origin);
  console.log('MongoDB URI:', process.env.MONGODB_URI);
});
