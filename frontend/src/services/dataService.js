// src/services/dataService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/data/';

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
 * Fetches all data items for the logged-in user.
 * @param {string} token - The user's JWT.
 * @returns {Promise<object>} The server's response containing the data items.
 */
const getData = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/');
    return response.data;
};

/**
 * Creates a new data item.
 * @param {object} dataItem - The data to submit { title, description }.
 * @param {string} token - The user's JWT.
 * @returns {Promise<object>} The server's response containing the newly created item.
 */
const createData = async (dataItem, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.post('/', dataItem);
    return response.data;
};

const dataService = {
    getData,
    createData,
};

export default dataService;
