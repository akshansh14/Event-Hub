const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: {
    type: String,
    required: true
  },
  location: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: [
      "Social Events",
      "Corporate Events",
      "Cultural Events",
      "Sporting Events",
      "Educational Events",
      "Political Events",
      "Charity Events",
      "Religious Events",
      "Trade and Commercial Events",
      "Entertainment Events",
      "Environmental Events",
      "Technological Events",
      "Government Events"
    ]
  },
  image: { 
    type: String 
  },
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  attendees: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
