// routes/customerRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customerController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// Apply admin-only authorization to all routes in this file
router.use(protect, authorize('admin'));

// Route for getting all customers and creating a new one
router.route('/')
    .get(getAllCustomers)
    .post(createCustomer);

// Route for getting, updating, and deleting a single customer by its ID
router.route('/:id')
    .get(getCustomerById)
    .put(updateCustomer)
    .delete(deleteCustomer);

module.exports = router;
