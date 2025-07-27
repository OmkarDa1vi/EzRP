// controllers/configController.js

const ProductFieldConfig = require('../models/ProductFieldConfig');

/**
 * @desc    Get the active product field configuration
 * @route   GET /api/config/fields
 * @access  Private (Admin)
 */
exports.getProductFieldConfig = async (req, res) => {
    try {
        // We use findOne and create if not exists (upsert) to ensure there's always a config document.
        // The configKey 'main' ensures we're always working with the same single document.
        let config = await ProductFieldConfig.findOne({ configKey: 'main' });

        if (!config) {
            // If for some reason no config exists, create one with default values.
            config = new ProductFieldConfig();
            await config.save();
        }

        res.status(200).json(config);
    } catch (error) {
        console.error('Error fetching field config:', error);
        res.status(500).json({ message: 'Server error while fetching configuration.' });
    }
};

/**
 * @desc    Update the active product field configuration
 * @route   PUT /api/config/fields
 * @access  Private (Admin)
 */
exports.updateProductFieldConfig = async (req, res) => {
    try {
        const { activeFields } = req.body;

        // Basic validation: ensure activeFields is an array.
        if (!Array.isArray(activeFields)) {
            return res.status(400).json({ message: 'Invalid data format. activeFields must be an array.' });
        }

        // Use findOneAndUpdate with 'upsert: true' to either update the existing document
        // or create it if it doesn't exist. 'new: true' ensures the updated document is returned.
        const updatedConfig = await ProductFieldConfig.findOneAndUpdate(
            { configKey: 'main' },
            { activeFields: activeFields },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json(updatedConfig);
    } catch (error) {
        console.error('Error updating field config:', error);
        // Handle potential validation errors from the model's 'enum' constraint
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while updating configuration.' });
    }
};
