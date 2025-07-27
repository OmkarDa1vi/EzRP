// routes/productRoutes.js

const express = require('express');
const router = express.Router();

const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// OLD WAY: router.use(protect, authorize('MANAGE_PRODUCTS'));
// NEW WAY: A user must have a permission where module='products' AND action='manage'
router.use(protect, authorize('products', 'manage'));

// Routes remain the same
router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;
