// routes/salesOrderRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createSalesOrder,
    getAllSalesOrders,
    getSalesOrderById,
    updateSalesOrder
} = require('../controllers/salesOrderController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// Apply admin-only authorization to all routes in this file
router.use(protect, authorize('admin'));

// Route for getting all sales orders and creating a new one
router.route('/')
    .get(getAllSalesOrders)
    .post(createSalesOrder);

// Route for getting and updating a single sales order by its ID
router.route('/:id')
    .get(getSalesOrderById)
    .put(updateSalesOrder);

module.exports = router;
