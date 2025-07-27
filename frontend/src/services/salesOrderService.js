// src/services/salesOrderService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/salesorders/';

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
 * Fetches all sales orders.
 * @param {string} token - The admin's JWT.
 */
const getAll = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/');
    return response.data;
};

/**
 * Fetches a single sales order by its ID.
 * @param {string} id - The ID of the SO to fetch.
 * @param {string} token - The admin's JWT.
 */
const getById = async (id, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get(`/${id}`);
    return response.data;
};

/**
 * Creates a new sales order.
 * @param {object} soData - The data for the new sales order.
 * @param {string} token - The admin's JWT.
 */
const create = async (soData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.post('/', soData);
    return response.data;
};

/**
 * Updates an existing sales order.
 * @param {string} id - The ID of the SO to update.
 * @param {object} soData - The updated data for the sales order.
 * @param {string} token - The admin's JWT.
 */
const update = async (id, soData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.put(`/${id}`, soData);
    return response.data;
};

const salesOrderService = {
    getAll,
    getById,
    create,
    update,
};

export default salesOrderService;
