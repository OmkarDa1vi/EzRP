// models/Warehouse.js

const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Warehouse name is required.'],
        trim: true,
        unique: true,
    },
    location: {
        type: String,
        required: [true, 'Warehouse location is required.'],
        trim: true,
    },
    // This creates a reference to the User model for the warehouse manager.
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A manager is required for the warehouse.'],
    },
}, {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
