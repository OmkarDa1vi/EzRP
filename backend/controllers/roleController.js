// controllers/roleController.js

const Role = require('../models/Role');

/**
 * @desc    Create a new role
 * @route   POST /api/roles
 * @access  Private (Requires 'MANAGE_ROLES' permission)
 */
exports.createRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Role name is required.' });
        }

        const role = new Role({ name, description, permissions });
        const createdRole = await role.save();
        res.status(201).json(createdRole);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A role with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error while creating role.', error: error.message });
    }
};

/**
 * @desc    Get all roles
 * @route   GET /api/roles
 * @access  Private (Requires 'MANAGE_ROLES' permission)
 */
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching roles.', error: error.message });
    }
};

/**
 * @desc    Get a single role by ID
 * @route   GET /api/roles/:id
 * @access  Private (Requires 'MANAGE_ROLES' permission)
 */
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found.' });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching role.', error: error.message });
    }
};

/**
 * @desc    Update a role
 * @route   PUT /api/roles/:id
 * @access  Private (Requires 'MANAGE_ROLES' permission)
 */
exports.updateRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found.' });
        }

        // Prevent modification of default system roles
        if (role.isDefault) {
            return res.status(400).json({ message: 'Default system roles cannot be modified.' });
        }

        role.name = name ?? role.name;
        role.description = description ?? role.description;
        role.permissions = permissions ?? role.permissions;

        const updatedRole = await role.save();
        res.status(200).json(updatedRole);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A role with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error while updating role.', error: error.message });
    }
};

/**
 * @desc    Delete a role
 * @route   DELETE /api/roles/:id
 * @access  Private (Requires 'MANAGE_ROLES' permission)
 */
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ message: 'Role not found.' });
        }

        // Prevent deletion of default system roles
        if (role.isDefault) {
            return res.status(400).json({ message: 'Default system roles cannot be deleted.' });
        }

        // Optional: Add a check to see if any users are assigned this role before deleting.

        await role.deleteOne();

        res.status(200).json({ message: 'Role removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting role.', error: error.message });
    }
};
