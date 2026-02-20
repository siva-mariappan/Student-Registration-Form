const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, getUserStats } = require('../controllers/userController');
const { ensureAuth } = require('../middleware/authMiddleware');

// GET /api/users - Get all users (PROTECTED)
router.get('/', ensureAuth, getAllUsers);

// GET /api/users/stats - Get user statistics (PROTECTED)
router.get('/stats', ensureAuth, getUserStats);

// GET /api/users/:id - Get user by ID (PROTECTED)
router.get('/:id', ensureAuth, getUserById);

module.exports = router;
