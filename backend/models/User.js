// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true // Removes whitespace from both ends of a string
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true, // Ensures every email is unique in the database
        lowercase: true, // Converts email to lowercase before saving
        match: [ // Regular expression to validate email format
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6 // Enforces a minimum password length
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // The role must be either 'user' or 'admin'
        default: 'user' // Default role for new users
    }
}, {
    // Adds createdAt and updatedAt timestamps to the document
    timestamps: true
});

// --- Mongoose Middleware ---

// 'pre-save' middleware to hash the password before saving a new user document
// This function runs before a document is saved to the database.
// We use a regular function here, not an arrow function, so that 'this' refers to the document.
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    // Generate a salt with a cost factor of 12
    const salt = await bcrypt.genSalt(12);
    // Hash the password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Mongoose Instance Method ---

// Method to compare a candidate password with the user's hashed password
// This will be used during the login process.
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
