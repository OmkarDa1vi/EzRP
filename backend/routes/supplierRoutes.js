// routes/supplierRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require('../controllers/supplierController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// Apply admin-only authorization to all routes in this file
router.use(protect, authorize('admin'));

// Route for getting all suppliers and creating a new one
router.route('/')
    .get(getAllSuppliers)
    .post(createSupplier);

// Route for getting, updating, and deleting a single supplier by its ID
router.route('/:id')
    .get(getSupplierById)
    .put(updateSupplier)
    .delete(deleteSupplier);

module.exports = router;
