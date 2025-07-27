// controllers/authController.js

const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');

// Helper function to sign a JWT
// The payload now contains a structured list of permission objects
const generateToken = (user) => {
    // Map the populated permission documents into a clean array for the JWT
    const permissions = user.roleId.permissions.map(p => ({
        module: p.module,
        action: p.action,
    }));

    return jwt.sign(
        { 
            id: user._id, 
            role: user.roleId.name,
            permissions: permissions // The new structured array
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: '1d',
        }
    );
};

// --- Sign-Up Controller ---
// This function remains largely the same, but benefits from the new generateToken
exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone, roleName = 'user' } = req.body;

        const userRole = await Role.findOne({ name: roleName });
        if (!userRole) {
            return res.status(400).json({ message: `Role '${roleName}' does not exist.` });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const newUser = new User({
            name,
            email,
            phone,
            passwordHash: password,
            roleId: userRole._id,
        });

        await newUser.save();
        
        // --- CRITICAL: Nested Populate ---
        // We now populate the role, and within the role, we populate the permissions.
        await newUser.populate({
            path: 'roleId',
            populate: {
                path: 'permissions'
            }
        });

        const token = generateToken(newUser);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.roleId.name,
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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        // --- CRITICAL: Nested Populate on Sign-In ---
        const user = await User.findOne({ email })
            .select('+passwordHash')
            .populate({
                path: 'roleId',
                populate: {
                    path: 'permissions'
                }
            });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }
        
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        const token = generateToken(user);

        res.status(200).json({
            status: 'success',
            token,
             data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.roleId.name,
                },
            },
        });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong on the server.', error: error.message });
    }
};
