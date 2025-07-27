// models/Role.js

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    // This is the key change: The 'permissions' field is now an array of ObjectIds,
    // each referencing a document in the 'Permission' collection.
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    isDefault: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
