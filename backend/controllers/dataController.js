// controllers/dataController.js

const DataItem = require('../models/DataItem');

/**
 * @desc    Create a new data item
 * @route   POST /api/data
 * @access  Private
 */
exports.createDataItem = async (req, res) => {
    try {
        const { title, description } = req.body;

        // The user's ID is available from the 'protect' middleware (req.user)
        const userId = req.user.id;

        // Basic validation
        if (!title || !description) {
            return res.status(400).json({ message: 'Please provide a title and description.' });
        }

        const dataItem = new DataItem({
            title,
            description,
            user: userId, // Link the data item to the logged-in user
        });

        const createdItem = await dataItem.save();

        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Error creating data item:', error);
        res.status(500).json({ message: 'Server error while creating data item.' });
    }
};

/**
 * @desc    Get all data items for the logged-in user
 * @route   GET /api/data
 * @access  Private
 */
exports.getDataItems = async (req, res) => {
    try {
        // Find all data items that belong to the currently logged-in user
        // The user's ID is available from req.user.id
        const dataItems = await DataItem.find({ user: req.user.id });
        
        // If no items are found, it's not an error, just return an empty array
        res.status(200).json(dataItems);
    } catch (error) {
        console.error('Error fetching data items:', error);
        res.status(500).json({ message: 'Server error while fetching data items.' });
    }
};
