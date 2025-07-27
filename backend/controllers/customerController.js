// controllers/customerController.js

const Customer = require('../models/Customer');

/**
 * @desc    Create a new customer
 * @route   POST /api/customers
 * @access  Private (Admin)
 */
exports.createCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        const createdCustomer = await customer.save();
        res.status(201).json(createdCustomer);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A customer with this name or email already exists.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating customer.', error: error.message });
    }
};

/**
 * @desc    Get all customers
 * @route   GET /api/customers
 * @access  Private (Admin)
 */
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching customers.', error: error.message });
    }
};

/**
 * @desc    Get a single customer by ID
 * @route   GET /api/customers/:id
 * @access  Private (Admin)
 */
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching customer.', error: error.message });
    }
};

/**
 * @desc    Update a customer
 * @route   PUT /api/customers/:id
 * @access  Private (Admin)
 */
exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }
        res.status(200).json(customer);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A customer with this name or email already exists.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while updating customer.', error: error.message });
    }
};

/**
 * @desc    Delete a customer
 * @route   DELETE /api/customers/:id
 * @access  Private (Admin)
 */
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        // Optional: Prevent deletion if the customer has existing orders.
        // We would add that logic here later.

        await customer.deleteOne();

        res.status(200).json({ message: 'Customer removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting customer.', error: error.message });
    }
};
