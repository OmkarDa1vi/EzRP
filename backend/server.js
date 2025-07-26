// server.js

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// --- IMPORT ROUTE FILES ---
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes'); // <-- ADD THIS LINE

// Initialize the Express app
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001;

if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB.');
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1);
    });


// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes); // <-- ADD THIS LINE


// A simple test route to ensure the server is working
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the MERN Auth API!' });
});
