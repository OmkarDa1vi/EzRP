// src/services/auditLogService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/auditlogs/';

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
 * Fetches all audit log entries with pagination.
 * @param {string} token - The admin's JWT.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of logs per page.
 */
const getAll = async (token, page = 1, limit = 25) => {
    const apiClient = getAuthApiClient(token);
    // Pass pagination parameters as query params
    const response = await apiClient.get(`?page=${page}&limit=${limit}`);
    return response.data;
};

const auditLogService = {
    getAll,
};

export default auditLogService;
