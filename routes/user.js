const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Display all users
router.get('/', userController.getAllUsers);

// Display form to create a new user
router.get('/new', userController.newUserForm);

// Create a new user
router.post('/', userController.createUser);

// Display a single user
router.get('/:id', userController.getUserById);

// Edit a user
router.get('/:id/edit', userController.editUserForm);
router.put('/:id', userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
