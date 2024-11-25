const express = require('express');
const router = express.Router();
const followupController = require('../controllers/followupController');

// Display all follow-ups
router.get('/', followupController.getAllFollowups);

// Display form to create a new follow-up
router.get('/new', followupController.newFollowupForm);

// Create a new follow-up
router.post('/', followupController.createFollowup);

// Display a single follow-up
router.get('/:id', followupController.getFollowupById);

// Edit a follow-up
router.get('/:id/edit', followupController.editFollowupForm);
router.put('/:id', followupController.updateFollowup);

// Delete a follow-up
router.delete('/:id', followupController.deleteFollowup);

module.exports = router;
