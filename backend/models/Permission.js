// models/Permission.js

const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    module: {
        type: String,
        required: true,
        trim: true,
        // e.g., 'products', 'users', 'sales'
    },
    action: {
        type: String,
        required: true,
        trim: true,
        // e.g., 'create', 'read', 'update', 'delete'
    },
    scope: {
        type: String,
        trim: true,
        enum: ['own', 'all', 'department'],
        // e.g., allow a user to only edit their 'own' records
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    // Create a unique compound index to prevent duplicate permissions
    // (e.g., can't have two 'products'-'create' permissions)
    indexes: [{ unique: true, fields: ['module', 'action'] }]
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
