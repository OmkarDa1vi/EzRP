// routes/auditLogRoutes.js

const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/auditLogController');
const { protect, authorize } = require('../middleware/authMiddleware');

// A user must have a permission where module='audit_logs' AND action='read'
router.route('/').get(protect, authorize('audit_logs', 'read'), getAllLogs);

module.exports = router;
