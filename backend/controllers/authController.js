// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to sign a JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token will expire in 1 day
    });
};

// --- Sign-Up Controller ---
exports.signup = async (req, res) => {
    try {
        // Destructure name, email, password, and role from the request body
        const { name, email, password, role } = req.body;

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password,
            role, // role can be 'user' or 'admin'
        });

        // The password will be hashed automatically by the pre-save middleware in User.js
        await newUser.save();

        // Generate a token for the new user
        const token = generateToken(newUser._id, newUser.role);

        // Send a success response with the token and user info
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
        });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong on the server.', error: error.message });
    }
};


// --- Sign-In Controller ---
exports.signin = async (req, res) => {
    try {
        // Destructure email and password from the request body
        const { email, password } = req.body;

        // Check if email or password was provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        // Find the user by email. We use .select('+password') to explicitly include the password,
        // as we might set it to be excluded by default in the future.
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists and if the password is correct
        // We use the comparePassword method we defined in the User model
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        // If credentials are correct, generate a token
        const token = generateToken(user._id, user.role);

        // Send a success response with the token
        res.status(200).json({
            status: 'success',
            token,
             data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong on the server.', error: error.message });
    }
};
