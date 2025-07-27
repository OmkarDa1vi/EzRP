// controllers/productController.js

const Product = require('../models/Product');
const { logAction } = require('../services/auditLogService'); // <-- Import the logging service

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Admin)
 */
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();

        // --- AUDIT LOG ---
        logAction({
            userId: req.user.id,
            action: `created product '${createdProduct.name}' (SKU: ${createdProduct.sku})`,
            actionType: 'CREATE',
            module: 'products',
            recordId: createdProduct._id,
            newValues: createdProduct.toObject(), // Log the newly created document
            ipAddress: req.ip,
        });
        // --- END AUDIT LOG ---

        res.status(201).json(createdProduct);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A product with this SKU already exists.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating product.', error: error.message });
    }
};

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Private (Admin)
 */
exports.getAllProducts = async (req, res) => {
    // No audit log needed for read operations unless specifically required.
    try {
        const products = await Product.find({}).populate('categoryId', 'name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching products.', error: error.message });
    }
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Private (Admin)
 */
exports.getProductById = async (req, res) => {
    // No audit log needed for read operations.
    try {
        const product = await Product.findById(req.params.id).populate('categoryId', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching product.', error: error.message });
    }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private (Admin)
 */
exports.updateProduct = async (req, res) => {
    try {
        // 1. Find the document BEFORE the update to get its original state
        const previousProduct = await Product.findById(req.params.id).lean();
        if (!previousProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // 2. Perform the update
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // --- AUDIT LOG ---
        logAction({
            userId: req.user.id,
            action: `updated product '${updatedProduct.name}' (SKU: ${updatedProduct.sku})`,
            actionType: 'UPDATE',
            module: 'products',
            recordId: updatedProduct._id,
            previousValues: previousProduct, // Log the state before the change
            newValues: updatedProduct.toObject(), // Log the state after the change
            ipAddress: req.ip,
        });
        // --- END AUDIT LOG ---

        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A product with this SKU already exists.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while updating product.', error: error.message });
    }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
exports.deleteProduct = async (req, res) => {
    try {
        // 1. Find the document to be deleted to capture its state
        const productToDelete = await Product.findById(req.params.id);
        if (!productToDelete) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // 2. Perform the deletion
        await productToDelete.deleteOne();

        // --- AUDIT LOG ---
        logAction({
            userId: req.user.id,
            action: `deleted product '${productToDelete.name}' (SKU: ${productToDelete.sku})`,
            actionType: 'DELETE',
            module: 'products',
            recordId: productToDelete._id,
            previousValues: productToDelete.toObject(), // Log the state of the document that was deleted
            ipAddress: req.ip,
        });
        // --- END AUDIT LOG ---

        res.status(200).json({ message: 'Product removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting product.', error: error.message });
    }
};
