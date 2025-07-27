// routes/configRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const { getProductFieldConfig, updateProductFieldConfig } = require('../controllers/configController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// All routes in this file are for managing configuration.
// We apply both 'protect' and 'authorize('admin')' middleware to the routes.
// This ensures that only a logged-in user with the role of 'admin' can access them.

router.route('/fields')
    .get(protect, authorize('admin'), getProductFieldConfig)      // GET /api/config/fields
    .put(protect, authorize('admin'), updateProductFieldConfig);   // PUT /api/config/fields

module.exports = router;
