// models/Supplier.js

const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Supplier name is required.'],
        trim: true,
        unique: true,
    },
    contactName: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [ // Optional: basic email validation
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    address: {
        type: String,
        trim: true,
    },
    leadTimeDays: {
        type: Number,
        min: 0,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
}, {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
