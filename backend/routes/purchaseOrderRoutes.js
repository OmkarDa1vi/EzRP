// routes/purchaseOrderRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrder
} = require('../controllers/purchaseOrderController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// Apply admin-only authorization to all routes in this file
router.use(protect, authorize('admin'));

// Route for getting all POs and creating a new one
router.route('/')
    .get(getAllPurchaseOrders)
    .post(createPurchaseOrder);

// Route for getting and updating a single PO by its ID
router.route('/:id')
    .get(getPurchaseOrderById)
    .put(updatePurchaseOrder);

module.exports = router;
