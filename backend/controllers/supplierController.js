// controllers/supplierController.js

const Supplier = require('../models/Supplier');

/**
 * @desc    Create a new supplier
 * @route   POST /api/suppliers
 * @access  Private (Admin)
 */
exports.createSupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        const createdSupplier = await supplier.save();
        res.status(201).json(createdSupplier);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A supplier with this name already exists.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating supplier.', error: error.message });
    }
};

/**
 * @desc    Get all suppliers
 * @route   GET /api/suppliers
 * @access  Private (Admin)
 */
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({});
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching suppliers.', error: error.message });
    }
};

/**
 * @desc    Get a single supplier by ID
 * @route   GET /api/suppliers/:id
 * @access  Private (Admin)
 */
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching supplier.', error: error.message });
    }
};

/**
 * @desc    Update a supplier
 * @route   PUT /api/suppliers/:id
 * @access  Private (Admin)
 */
exports.updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A supplier with this name already exists.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while updating supplier.', error: error.message });
    }
};

/**
 * @desc    Delete a supplier
 * @route   DELETE /api/suppliers/:id
 * @access  Private (Admin)
 */
exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }

        // Optional: Prevent deletion if the supplier is linked to Purchase Orders.
        // We would add that logic here later.

        await supplier.deleteOne();

        res.status(200).json({ message: 'Supplier removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting supplier.', error: error.message });
    }
};
