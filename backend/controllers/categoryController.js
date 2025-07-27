// controllers/categoryController.js

const Category = require('../models/Category');

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
exports.createCategory = async (req, res) => {
    try {
        const { name, parentId, tags } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required.' });
        }

        const category = new Category({ name, parentId, tags });
        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        // Handle potential duplicate key error for the 'name' field
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A category with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error while creating category.', error: error.message });
    }
};

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Private (Admin)
 */
exports.getAllCategories = async (req, res) => {
    try {
        // We use .populate() to get the name of the parent category instead of just its ID
        const categories = await Category.find({}).populate('parentId', 'name');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching categories.', error: error.message });
    }
};

/**
 * @desc    Get a single category by ID
 * @route   GET /api/categories/:id
 * @access  Private (Admin)
 */
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parentId', 'name');
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching category.', error: error.message });
    }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
exports.updateCategory = async (req, res) => {
    try {
        const { name, parentId, tags } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, parentId, tags },
            { new: true, runValidators: true } // 'new: true' returns the updated document
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.status(200).json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A category with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error while updating category.', error: error.message });
    }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Optional: Prevent deletion if it's a parent to other categories
        const childCategories = await Category.countDocuments({ parentId: req.params.id });
        if (childCategories > 0) {
            return res.status(400).json({ message: 'Cannot delete category. It is a parent to other categories.' });
        }

        await category.deleteOne(); // Use deleteOne() on the document

        res.status(200).json({ message: 'Category removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting category.', error: error.message });
    }
};
