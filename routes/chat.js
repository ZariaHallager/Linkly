const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Display all chats
router.get('/', chatController.getAllChats);

// Display form to start a new chat
router.get('/new', chatController.newChatForm);

// Create a new chat
router.post('/', chatController.createChat);

// Display a single chat
router.get('/:id', chatController.getChatById);

// Send a new message to a chat
router.post('/:id/message', chatController.sendMessage);

// Edit chat settings (e.g., title)
router.get('/:id/edit', chatController.editChatForm);
router.put('/:id', chatController.updateChat);

// Delete a chat
router.delete('/:id', chatController.deleteChat);

module.exports = router;
