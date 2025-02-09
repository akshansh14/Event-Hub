const express = require('express');
const { getEvents, getEventById, createEvent, attendEvent, cancelEvent, updateEvent, unattendEvent } = require('../controllers/eventController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', auth, upload.single('image'), createEvent);
router.post('/:id/attend', auth, attendEvent);
router.post('/:id/unattend', auth, unattendEvent);
router.delete('/:id', auth, cancelEvent);
router.put('/:id', auth, updateEvent);

module.exports = router;
