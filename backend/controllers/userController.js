// controllers/userController.js

const User = require('../models/User');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin)
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users and exclude their passwords from the result
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching users.', error: error.message });
    }
};
