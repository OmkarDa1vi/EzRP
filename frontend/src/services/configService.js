// src/services/configService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/config/';

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
 * Fetches the product field configuration.
 * @param {string} token - The admin's JWT.
 * @returns {Promise<object>} The server's response containing the config object.
 */
const getFieldConfig = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/fields');
    return response.data;
};

/**
 * Updates the product field configuration.
 * @param {string[]} activeFields - An array of the selected field names.
 * @param {string} token - The admin's JWT.
 * @returns {Promise<object>} The server's response containing the updated config object.
 */
const updateFieldConfig = async (activeFields, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.put('/fields', { activeFields });
    return response.data;
};

const configService = {
    getFieldConfig,
    updateFieldConfig,
};

export default configService;
