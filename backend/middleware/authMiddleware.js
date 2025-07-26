// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes that require authentication.
 * It verifies the JWT from the Authorization header.
 */
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract the token from the header (e.g., "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using the JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Find the user by the ID from the token's payload.
            // We attach the user object to the request, excluding the password.
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // 5. If everything is valid, proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is found in the header
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * Middleware to restrict access to specific roles.
 * This should be used *after* the 'protect' middleware.
 * @param {...string} roles - A list of roles that are allowed to access the route.
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role '${req.user.role}' is not authorized to access this route` });
        }
        next();
    };
};
