// controllers/salesOrderController.js

const SalesOrder = require('../models/SalesOrder');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

/**
 * @desc    Create a new sales order
 * @route   POST /api/salesorders
 * @access  Private (Admin)
 */
exports.createSalesOrder = async (req, res) => {
    try {
        const { customerId, items, discounts, taxAmount, status, shipmentStatus, paymentMethod, shippingAddress, notes } = req.body;
        const salesPersonId = req.user.id; // The user creating the order

        // --- Validation ---
        if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Customer and at least one item are required.' });
        }

        // --- Server-side Calculation ---
        let subtotal = 0;
        for (const item of items) {
            if (!item.productId || !item.quantity || item.price == null) {
                return res.status(400).json({ message: 'Each item must have a product, quantity, and price.' });
            }
            subtotal += item.quantity * item.price;
        }
        
        const finalDiscounts = Number(discounts) || 0;
        const finalTaxAmount = Number(taxAmount) || 0;
        const totalAmount = (subtotal - finalDiscounts) + finalTaxAmount;

        const so = new SalesOrder({
            customerId,
            salesPersonId,
            items,
            subtotal,
            discounts: finalDiscounts,
            taxAmount: finalTaxAmount,
            totalAmount,
            status,
            shipmentStatus,
            paymentMethod,
            shippingAddress,
            notes,
        });

        const createdSO = await so.save();
        res.status(201).json(createdSO);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating sales order.', error: error.message });
    }
};

/**
 * @desc    Get all sales orders
 * @route   GET /api/salesorders
 * @access  Private (Admin)
 */
exports.getAllSalesOrders = async (req, res) => {
    try {
        const sos = await SalesOrder.find({})
            .sort({ orderDate: -1 })
            .populate('customerId', 'name')
            .populate('salesPersonId', 'name');
            
        res.status(200).json(sos);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching sales orders.', error: error.message });
    }
};

/**
 * @desc    Get a single sales order by ID
 * @route   GET /api/salesorders/:id
 * @access  Private (Admin)
 */
exports.getSalesOrderById = async (req, res) => {
    try {
        const so = await SalesOrder.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('salesPersonId', 'name')
            .populate('items.productId', 'name sku');

        if (!so) {
            return res.status(404).json({ message: 'Sales Order not found.' });
        }
        res.status(200).json(so);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching sales order.', error: error.message });
    }
};

/**
 * @desc    Update a sales order
 * @route   PUT /api/salesorders/:id
 * @access  Private (Admin)
 */
exports.updateSalesOrder = async (req, res) => {
    try {
        const soToUpdate = await SalesOrder.findById(req.params.id);
        if (!soToUpdate) {
            return res.status(404).json({ message: 'Sales Order not found.' });
        }

        // Update fields from request body
        const { status, shipmentStatus, paymentMethod, shippingAddress, notes, invoiced, invoiceId } = req.body;
        
        soToUpdate.status = status ?? soToUpdate.status;
        soToUpdate.shipmentStatus = shipmentStatus ?? soToUpdate.shipmentStatus;
        soToUpdate.paymentMethod = paymentMethod ?? soToUpdate.paymentMethod;
        soToUpdate.shippingAddress = shippingAddress ?? soToUpdate.shippingAddress;
        soToUpdate.notes = notes ?? soToUpdate.notes;
        soToUpdate.invoiced = invoiced ?? soToUpdate.invoiced;
        soToUpdate.invoiceId = invoiceId ?? soToUpdate.invoiceId;

        const updatedSO = await soToUpdate.save();
        res.status(200).json(updatedSO);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while updating sales order.', error: error.message });
    }
};
