const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { initializeSocket } = require('./utils/socketManager');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize socket.io
const io = initializeSocket(server);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(()=>{
  console.log("Connected to MongoDB");
}).catch((err)=>{
  console.log(err);
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
