// models/DataItem.js

const mongoose = require('mongoose');

const dataItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true,
    },
    // This creates a reference to the User model.
    // It links each data item to the user who created it.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The 'ref' should match the model name we used for the User schema
        required: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const DataItem = mongoose.model('DataItem', dataItemSchema);

module.exports = DataItem;
