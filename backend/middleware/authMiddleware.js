// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes that require authentication.
 * It verifies the JWT and attaches the user (with their full role and permission documents) to the request.
 */
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Extract and verify the token
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 2. Find the user and perform a nested populate to get full permission details
            req.user = await User.findById(decoded.id).populate({
                path: 'roleId',
                populate: {
                    path: 'permissions'
                }
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            if (!req.user.isActive) {
                return res.status(401).json({ message: 'Not authorized, user account is disabled.' });
            }

            // 3. Proceed
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * Middleware to restrict access based on a required module and action.
 * This should be used *after* the 'protect' middleware.
 * @param {string} requiredModule - The module the user needs permission for (e.g., 'products').
 * @param {string} requiredAction - The action the user needs permission for (e.g., 'manage', 'create', 'read').
 */
exports.authorize = (requiredModule, requiredAction) => {
    return (req, res, next) => {
        // 1. Check if user and their populated role/permissions exist
        if (!req.user || !req.user.roleId || !req.user.roleId.permissions) {
            return res.status(403).json({ message: 'User has no permissions assigned.' });
        }

        const userPermissions = req.user.roleId.permissions;

        // 2. Check if the user's permissions array contains an object that matches the required module and action.
        const hasPermission = userPermissions.some(
            p => p.module === requiredModule && p.action === requiredAction
        );

        if (!hasPermission) {
            return res.status(403).json({ message: `User does not have the required '${requiredAction}' permission for the '${requiredModule}' module.` });
        }
        
        // 3. If the check passes, proceed
        next();
    };
};
