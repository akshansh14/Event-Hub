# 🎉 Event Hub

Event Hub is a modern web application for creating and managing events. Built with React, Node.js, and Socket.IO, it offers real-time updates and a seamless user experience.

## ✨ Features

- 🔄 **Real-time Updates**: Live event updates using Socket.IO
- 🎨 **Modern UI**: Sleek design with glass morphism effects
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🔐 **User Authentication**: Secure login and registration
- 🎯 **Event Management**: Create, update, and manage events
- 👥 **Attendee Tracking**: Real-time attendee management
- ⚡ **Fast Performance**: Built with Vite and React
- 🌈 **Beautiful Animations**: Powered by Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/event-hub.git
   cd event-hub
   ```

2. **Install Dependencies**:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**:
   ```bash
   # Server (.env)
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000

   # Client (.env)
   VITE_FRONTEND_URL=your_api_url
   ```

4. **Start Development Servers**:
   ```bash
   # Start server (from server directory)
   npm run dev

   # Start client (from client directory)
   npm run dev
   ```

## 🛠️ Tech Stack

### Frontend
- ⚛️ React
- 🏃 Framer Motion
- 🎨 Tailwind CSS
- 📡 Socket.IO Client
- 🔄 Redux Toolkit
- ⚡ Vite

### Backend
- 📡 Node.js & Express
- 🔄 Socket.IO
- 🗄️ MongoDB
- 🔐 JWT Authentication
- 🔄 Real-time Events

## 📂 Project Structure

```
event-hub/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   ├── api/          # API integration
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
└── server/               # Backend Node.js application
    ├── routes/           # API routes
    ├── models/           # MongoDB models
    ├── controllers/      # Route controllers
    └── utils/            # Utility functions
```

## 🌟 Key Features

1. **Real-time Event Updates**
   - Live attendee count
   - Instant event modifications
   - Real-time notifications

2. **Modern UI/UX**
   - Glass morphism effects
   - Smooth animations
   - Responsive design
   - Dark theme

3. **Event Management**
   - Create and edit events
   - Manage attendees
   - Event categories
   - Search and filters

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- React Team
- Tailwind CSS Team
- Socket.IO Team
- All contributors and supporters

