const express = require('express');
const router = express.Router();
const { registerStudent, getStudentById } = require('../controllers/studentController');
const { ensureAuth } = require('../middleware/authMiddleware');

// POST /api/students - Register new student (PROTECTED)
router.post('/', ensureAuth, registerStudent);

// GET /api/students/:id - Get student by ID (PROTECTED)
router.get('/:id', ensureAuth, getStudentById);

module.exports = router;
