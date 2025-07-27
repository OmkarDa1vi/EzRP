// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// This route will be protected and only accessible by admins
router.route('/').get(protect, authorize('admin'), getAllUsers);

module.exports = router;
