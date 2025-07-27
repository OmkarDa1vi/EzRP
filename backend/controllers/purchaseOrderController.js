// controllers/purchaseOrderController.js

const PurchaseOrder = require('../models/PurchaseOrder');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

/**
 * @desc    Create a new purchase order
 * @route   POST /api/pos
 * @access  Private (Admin)
 */
exports.createPurchaseOrder = async (req, res) => {
    try {
        const { supplierId, items, status, expectedDate } = req.body;

        // --- Validation ---
        if (!supplierId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Supplier and at least one item are required.' });
        }

        // Calculate total amount from items array
        let totalAmount = 0;
        for (const item of items) {
            if (!item.productId || !item.quantity || item.cost == null) {
                return res.status(400).json({ message: 'Each item must have a product, quantity, and cost.' });
            }
            totalAmount += item.quantity * item.cost;
        }

        const po = new PurchaseOrder({
            supplierId,
            items,
            status,
            expectedDate,
            totalAmount,
            // 'approvedBy' could be set here based on req.user if logic requires
        });

        const createdPO = await po.save();
        res.status(201).json(createdPO);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating purchase order.', error: error.message });
    }
};

/**
 * @desc    Get all purchase orders
 * @route   GET /api/pos
 * @access  Private (Admin)
 */
exports.getAllPurchaseOrders = async (req, res) => {
    try {
        const pos = await PurchaseOrder.find({})
            .sort({ orderDate: -1 })
            .populate('supplierId', 'name') // Get supplier's name
            .populate('items.productId', 'name sku'); // Get name/sku for each product in the items array
            
        res.status(200).json(pos);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching purchase orders.', error: error.message });
    }
};

/**
 * @desc    Get a single purchase order by ID
 * @route   GET /api/pos/:id
 * @access  Private (Admin)
 */
exports.getPurchaseOrderById = async (req, res) => {
    try {
        const po = await PurchaseOrder.findById(req.params.id)
            .populate('supplierId', 'name contactName email')
            .populate('approvedBy', 'name')
            .populate('items.productId', 'name sku brand');

        if (!po) {
            return res.status(404).json({ message: 'Purchase Order not found.' });
        }
        res.status(200).json(po);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching purchase order.', error: error.message });
    }
};

/**
 * @desc    Update a purchase order (e.g., change status, add received date)
 * @route   PUT /api/pos/:id
 * @access  Private (Admin)
 */
exports.updatePurchaseOrder = async (req, res) => {
    try {
        const { status, items, expectedDate, receivedDate } = req.body;
        
        const poToUpdate = await PurchaseOrder.findById(req.params.id);
        if (!poToUpdate) {
            return res.status(404).json({ message: 'Purchase Order not found.' });
        }

        // Recalculate total amount if items are being updated
        let totalAmount = poToUpdate.totalAmount;
        if (items && Array.isArray(items)) {
            totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.cost), 0);
            poToUpdate.items = items;
        }

        // Update fields
        poToUpdate.status = status ?? poToUpdate.status;
        poToUpdate.expectedDate = expectedDate ?? poToUpdate.expectedDate;
        poToUpdate.receivedDate = receivedDate ?? poToUpdate.receivedDate;
        poToUpdate.totalAmount = totalAmount;
        
        // If status is changing to 'pending', set the approver
        if (status === 'pending' && !poToUpdate.approvedBy) {
            poToUpdate.approvedBy = req.user.id;
        }

        const updatedPO = await poToUpdate.save();
        res.status(200).json(updatedPO);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while updating purchase order.', error: error.message });
    }
};
