// src/services/authService.js

import axios from 'axios';

// The base URL of our backend API
// We are using a variable from the environment, but falling back to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/auth/';

/**
 * Sends a request to the backend to register a new user.
 * @param {object} userData - The user's data (name, email, password, role).
 * @returns {Promise<object>} The server's response.
 */
const signup = (userData) => {
    return axios.post(API_URL + 'signup', userData);
};

/**
 * Sends a request to the backend to log in a user.
 * @param {object} credentials - The user's credentials (email, password).
 * @returns {Promise<object>} The server's response, including the JWT.
 */
const signin = (credentials) => {
    return axios.post(API_URL + 'signin', credentials);
};

// You can add other auth-related functions here later, like logout, getCurrentUser, etc.

const authService = {
    signup,
    signin,
};

export default authService;
