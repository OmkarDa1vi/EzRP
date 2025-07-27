// controllers/inventoryTransactionController.js

const InventoryTransaction = require('../models/InventoryTransaction');
// We will need to validate inputs against existing models
const Product = require('../models/Product'); // Note: We will create this model later
const Warehouse = require('../models/Warehouse');

/**
 * @desc    Create a new inventory transaction
 * @route   POST /api/inventory
 * @access  Private (Admin/User - depending on business logic)
 */
exports.createTransaction = async (req, res) => {
    try {
        const { productId, warehouseId, type, quantity, reason, relatedOrderId } = req.body;
        
        // The user performing the transaction is taken from the authenticated user session
        const transactionBy = req.user.id;

        // --- Basic Validation ---
        if (!productId || !warehouseId || !type || !quantity) {
            return res.status(400).json({ message: 'Product, warehouse, type, and quantity are required.' });
        }

        // --- Advanced Validation (optional but good practice) ---
        // Note: The Product model doesn't exist yet, so this check would fail.
        // We will comment it out for now and can re-enable it after creating the Product model.
        /*
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(400).json({ message: 'Invalid Product ID.' });
        }
        */

        const warehouseExists = await Warehouse.findById(warehouseId);
        if (!warehouseExists) {
            return res.status(400).json({ message: 'Invalid Warehouse ID.' });
        }

        const transaction = new InventoryTransaction({
            productId,
            warehouseId,
            type,
            quantity,
            reason,
            relatedOrderId,
            transactionBy,
        });

        const createdTransaction = await transaction.save();
        res.status(201).json(createdTransaction);

    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Server error while creating transaction.', error: error.message });
    }
};

/**
 * @desc    Get all inventory transactions
 * @route   GET /api/inventory
 * @access  Private (Admin/User)
 */
exports.getAllTransactions = async (req, res) => {
    try {
        // Find all transactions and sort by the newest first
        // Populate related fields to get details instead of just IDs
        const transactions = await InventoryTransaction.find({})
            .sort({ createdAt: -1 })
            .populate('productId', 'name sku') // We'll get name and SKU from Product
            .populate('warehouseId', 'name')
            .populate('transactionBy', 'name');
            
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error while fetching transactions.', error: error.message });
    }
};
