// src/services/userService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/users/';

/**
 * Creates an Axios instance with the authorization header.
 * @param {string} token - The user's JWT.
 * @returns {object} An Axios instance.
 */
const getAuthApiClient = (token) => {
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

/**
 * Fetches all users.
 * @param {string} token - The admin's JWT.
 */
const getAllUsers = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/');
    return response.data;
};

const userService = {
    getAllUsers,
};

export default userService;
