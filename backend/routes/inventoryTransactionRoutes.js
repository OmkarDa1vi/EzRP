// routes/inventoryTransactionRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createTransaction,
    getAllTransactions
} = require('../controllers/inventoryTransactionController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// For inventory transactions, both admins and regular users might need access.
// We will protect the routes but allow both roles for now.
// This can be changed later to be more restrictive if needed (e.g., authorize('admin')).
router.use(protect);

// Route for getting all transactions and creating a new one
router.route('/')
    .get(getAllTransactions)
    .post(createTransaction);

module.exports = router;
