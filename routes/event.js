const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Display all events
router.get('/', eventController.getAllEvents);

// Display form to create a new event
router.get('/new', eventController.newEventForm);

// Create a new event
router.post('/', eventController.createEvent);

// Display a single event
router.get('/:id', eventController.getEventById);

// Edit an event
router.get('/:id/edit', eventController.editEventForm);
router.put('/:id', eventController.updateEvent);

// Delete an event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
