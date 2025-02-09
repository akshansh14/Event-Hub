const Event = require('../models/Event');
const cloudinary = require('../utils/cloudinary');
const { getIO } = require('../utils/socketManager');

exports.getEvents = async (req, res) => {
  try {
    const { category, date } = req.query;
    let query = {};
    if (category) query.category = category;
    if (date) query.date = { $gte: new Date(date) };
    const events = await Event.find(query).populate('creator', 'name');
    res.json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creator', 'name');
    if (!event) throw new Error('Event not found');
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, category } = req.body;
    let image = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }
    const event = new Event({
      name,
      description,
      date,
      category,
      image,
      creator: req.user._id,
    });
    await event.save();
    
    // Emit to all connected clients
    getIO().emit('newEvent', {
      event,
      message: `New event "${event.name}" has been created!`
    });
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.attendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new Error('Event not found');
    
    if (event.attendees.includes(req.user._id)) {
      throw new Error('You are already attending this event');
    }
    
    event.attendees.push(req.user._id);
    await event.save();
    
    // Emit to event room
    getIO().to(`event:${event._id}`).emit('eventUpdated', {
      eventId: event._id,
      attendeesCount: event.attendees.length,
      message: `${req.user.name} is now attending this event!`
    });
    
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add new method to handle event cancellation
exports.cancelEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      creator: req.user._id 
    });
    
    if (!event) {
      throw new Error('Event not found or unauthorized');
    }

    await Event.deleteOne({ _id: event._id });
    
    // Notify all users in the event room
    getIO().to(`event:${event._id}`).emit('eventCancelled', {
      eventId: event._id,
      message: `Event "${event.name}" has been cancelled`
    });
    
    res.json({ message: 'Event cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
