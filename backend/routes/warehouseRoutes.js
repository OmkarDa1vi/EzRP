// routes/warehouseRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createWarehouse,
    getAllWarehouses,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse
} = require('../controllers/warehouseController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// Apply admin-only authorization to all routes in this file
router.use(protect, authorize('admin'));

// Route for getting all warehouses and creating a new one
router.route('/')
    .get(getAllWarehouses)
    .post(createWarehouse);

// Route for getting, updating, and deleting a single warehouse by its ID
router.route('/:id')
    .get(getWarehouseById)
    .put(updateWarehouse)
    .delete(deleteWarehouse);

module.exports = router;
