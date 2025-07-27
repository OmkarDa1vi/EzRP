// models/Customer.js

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Customer name is required.'],
        trim: true,
        unique: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        // Optional: Adding uniqueness and validation for email is good practice
        // unique: true, 
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    address: {
        type: String,
        trim: true,
    },
    loyaltyPoints: {
        type: Number,
        default: 0,
    },
    taxExempt: {
        type: Boolean,
        default: false,
    },
}, {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
