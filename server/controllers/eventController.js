const Event = require('../models/Event');
const cloudinary = require('../utils/cloudinary');
const { getIO } = require('../utils/socketManager');
const fs = require('fs');

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
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { name, description, date, time, category, location } = req.body;
    
    // Validate required fields
    if (!name || !description || !date || !time || !category || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { name, description, date, time, category, location }
      });
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        error: 'Invalid time format',
        received: time,
        expected: 'HH:mm format (e.g., 14:30)'
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format',
        received: date,
        expected: 'YYYY-MM-DD format'
      });
    }

    // Validate category
    const validCategories = [
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
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Invalid category',
        received: category,
        validCategories
      });
    }

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({
          error: 'Failed to upload image',
          details: uploadError.message
        });
      }
    }

    // Create and save the event
    const event = new Event({
      name,
      description,
      date: new Date(date), // Store date as Date object
      time, // Store time as string
      location,
      category,
      image: imageUrl,
      creator: req.user._id,
      attendees: []
    });

    await event.save();
    await event.populate('creator', 'name');
    
    // Emit socket event
    getIO().emit('newEvent', {
      event,
      message: `New event "${event.name}" has been created!`
    });
    
    res.status(201).json(event);

  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create event',
      details: error.errors
    });
  }
};

exports.attendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees', 'name email')
      .populate('creator', 'name');
      
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Check if user is already attending
    const isAttending = event.attendees.some(attendee => 
      attendee._id?.toString() === req.user._id.toString()
    );
    
    if (isAttending) {
      return res.status(400).json({ error: 'You are already attending this event' });
    }
    
    // Add user to attendees
    event.attendees.push(req.user._id);
    await event.save();
    
    // Populate the updated event
    const updatedEvent = await Event.findById(event._id)
      .populate('attendees', 'name email')
      .populate('creator', 'name');
    
    // Emit socket event
    getIO().emit('eventUpdated', {
      type: 'newAttendee',
      eventId: updatedEvent._id,
      attendees: updatedEvent.attendees,
      message: `${req.user.name} is now attending this event!`
    });
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Attend Event Error:', error);
    res.status(500).json({ error: 'Failed to attend event' });
  }
};

exports.unattendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees', 'name email')
      .populate('creator', 'name');
      
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Check if user is attending
    const isAttending = event.attendees.some(attendee => 
      attendee._id?.toString() === req.user._id.toString()
    );
    
    if (!isAttending) {
      return res.status(400).json({ error: 'You are not attending this event' });
    }
    
    // Remove user from attendees
    event.attendees = event.attendees.filter(attendee => 
      attendee._id?.toString() !== req.user._id.toString()
    );
    await event.save();
    
    // Populate the updated event
    const updatedEvent = await Event.findById(event._id)
      .populate('attendees', 'name email')
      .populate('creator', 'name');
    
    // Emit socket event
    getIO().emit('eventUpdated', {
      type: 'attendeeLeft',
      eventId: updatedEvent._id,
      attendees: updatedEvent.attendees,
      message: `${req.user.name} has left the event`
    });
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Unattend Event Error:', error);
    res.status(500).json({ error: 'Failed to leave event' });
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

// Add this function to handle event updates
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date, time, category, location } = req.body;
    
    // Validate time format
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        error: 'Invalid time format',
        received: time,
        expected: 'HH:mm format (e.g., 14:30)'
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format',
        received: date,
        expected: 'YYYY-MM-DD format'
      });
    }

    // Find event and check ownership
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        name,
        description,
        date: new Date(date),
        time,
        category,
        location
      },
      { new: true }
    )
    .populate('creator', 'name')
    .populate('attendees', 'name email createdAt');

    // Emit socket event
    getIO().emit('eventUpdated', {
      type: 'eventModified',
      eventId: updatedEvent._id,
      event: updatedEvent,
      message: `Event "${updatedEvent.name}" has been updated`
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};
