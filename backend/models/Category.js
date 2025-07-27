// models/Category.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required.'],
        trim: true,
        unique: true, // Ensures category names are not duplicated
    },
    // This allows for creating nested categories, e.g., "Electronics" -> "Laptops"
    // It references another document within the same Category collection.
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null, // A null parentId means it's a top-level category
    },
    tags: {
        type: [String], // An array of string keywords
        default: [],
    }
}, {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
