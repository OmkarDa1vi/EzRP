// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    phone: {
        type: String,
        trim: true,
    },
    profilePhoto: {
        type: String, // URL to the profile image
    },
    // We are renaming 'password' to 'passwordHash' for clarity
    passwordHash: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // By default, don't select/return the password hash
    },
    passwordResetToken: String,
    tokenExpiry: Date,
    // This is the new reference to the Role collection
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    lastLogin: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

// --- Mongoose Middleware ---

// 'pre-save' middleware to hash the password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('passwordHash')) {
        return next();
    }
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
});

// --- Mongoose Instance Method ---

// Method to compare a candidate password with the user's hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};


// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
