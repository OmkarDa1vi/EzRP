// controllers/warehouseController.js

const Warehouse = require('../models/Warehouse');
const User = require('../models/User'); // We need this to validate the managerId

/**
 * @desc    Create a new warehouse
 * @route   POST /api/warehouses
 * @access  Private (Admin)
 */
exports.createWarehouse = async (req, res) => {
    try {
        const { name, location, managerId } = req.body;

        if (!name || !location || !managerId) {
            return res.status(400).json({ message: 'Name, location, and manager are required.' });
        }
        
        // Optional: Check if the provided managerId corresponds to a real user
        const managerExists = await User.findById(managerId);
        if (!managerExists) {
            return res.status(400).json({ message: 'The selected manager does not exist.' });
        }

        const warehouse = new Warehouse({ name, location, managerId });
        const createdWarehouse = await warehouse.save();
        res.status(201).json(createdWarehouse);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A warehouse with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error while creating warehouse.', error: error.message });
    }
};

/**
 * @desc    Get all warehouses
 * @route   GET /api/warehouses
 * @access  Private (Admin)
 */
exports.getAllWarehouses = async (req, res) => {
    try {
        // We populate 'managerId' to get the user's name and email.
        const warehouses = await Warehouse.find({}).populate('managerId', 'name email');
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching warehouses.', error: error.message });
    }
};

/**
 * @desc    Get a single warehouse by ID
 * @route   GET /api/warehouses/:id
 * @access  Private (Admin)
 */
exports.getWarehouseById = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id).populate('managerId', 'name email');
        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found.' });
        }
        res.status(200).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching warehouse.', error: error.message });
    }
};

/**
 * @desc    Update a warehouse
 * @route   PUT /api/warehouses/:id
 * @access  Private (Admin)
 */
exports.updateWarehouse = async (req, res) => {
    try {
        const { name, location, managerId } = req.body;

        const warehouse = await Warehouse.findByIdAndUpdate(
            req.params.id,
            { name, location, managerId },
            { new: true, runValidators: true }
        );

        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found.' });
        }
        res.status(200).json(warehouse);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A warehouse with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error while updating warehouse.', error: error.message });
    }
};

/**
 * @desc    Delete a warehouse
 * @route   DELETE /api/warehouses/:id
 * @access  Private (Admin)
 */
exports.deleteWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);

        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found.' });
        }
        
        // Optional: Add a check here to prevent deletion if the warehouse has inventory.
        // For now, we will allow deletion.

        await warehouse.deleteOne();

        res.status(200).json({ message: 'Warehouse removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting warehouse.', error: error.message });
    }
};
