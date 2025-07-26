// routes/dataRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const { createDataItem, getDataItems } = require('../controllers/dataController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// Apply the 'protect' middleware to both routes.
// This means a user must be logged in to access them.
// The routes are combined using router.route('/') for cleaner code.
router.route('/')
    .post(protect, createDataItem) // POST /api/data
    .get(protect, getDataItems);   // GET /api/data

// Example of a route only an admin could access (we aren't using this one, but it shows how)
// router.get('/all', protect, authorize('admin'), getAllDataItemsFromAllUsers);

module.exports = router;
