// routes/roleRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole
} = require('../controllers/roleController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// Apply admin-only authorization to all routes in this file
// A user must have the 'MANAGE_ROLES' permission to access these routes.
router.use(protect, authorize('MANAGE_ROLES'));

// Route for getting all roles and creating a new one
router.route('/')
    .get(getAllRoles)
    .post(createRole);

// Route for getting, updating, and deleting a single role by its ID
router.route('/:id')
    .get(getRoleById)
    .put(updateRole)
    .delete(deleteRole);

module.exports = router;
