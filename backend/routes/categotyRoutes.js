// routes/categoryRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// Apply the admin-only authorization to all routes in this file.
// Any request to these endpoints must be from a logged-in admin.
router.use(protect, authorize('admin'));

// Route for getting all categories and creating a new one
router.route('/')
    .get(getAllCategories)
    .post(createCategory);

// Route for getting, updating, and deleting a single category by its ID
router.route('/:id')
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;
