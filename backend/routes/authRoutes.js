// routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Import the controller functions
const { signup, signin } = require('../controllers/authController');

// --- Route Definitions ---

// @route   POST /api/auth/signup
// @desc    Register a new user or admin
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post('/signin', signin);


// Export the router to be used in server.js
module.exports = router;
