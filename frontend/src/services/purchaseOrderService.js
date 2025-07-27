// src/services/purchaseOrderService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/pos/';

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
 * Fetches all purchase orders.
 * @param {string} token - The admin's JWT.
 */
const getAll = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/');
    return response.data;
};

/**
 * Fetches a single purchase order by its ID.
 * @param {string} id - The ID of the PO to fetch.
 * @param {string} token - The admin's JWT.
 */
const getById = async (id, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get(`/${id}`);
    return response.data;
};

/**
 * Creates a new purchase order.
 * @param {object} poData - The data for the new purchase order.
 * @param {string} token - The admin's JWT.
 */
const create = async (poData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.post('/', poData);
    return response.data;
};

/**
 * Updates an existing purchase order.
 * @param {string} id - The ID of the PO to update.
 * @param {object} poData - The updated data for the purchase order.
 * @param {string} token - The admin's JWT.
 */
const update = async (id, poData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.put(`/${id}`, poData);
    return response.data;
};

const purchaseOrderService = {
    getAll,
    getById,
    create,
    update,
};

export default purchaseOrderService;
