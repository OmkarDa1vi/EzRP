// src/services/supplierService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/suppliers/';

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
 * Fetches all suppliers.
 * @param {string} token - The admin's JWT.
 */
const getAll = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/');
    return response.data;
};

/**
 * Creates a new supplier.
 * @param {object} supplierData - The data for the new supplier.
 * @param {string} token - The admin's JWT.
 */
const create = async (supplierData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.post('/', supplierData);
    return response.data;
};

/**
 * Updates an existing supplier.
 * @param {string} id - The ID of the supplier to update.
 * @param {object} supplierData - The updated data for the supplier.
 * @param {string} token - The admin's JWT.
 */
const update = async (id, supplierData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.put(`/${id}`, supplierData);
    return response.data;
};

/**
 * Deletes a supplier.
 * @param {string} id - The ID of the supplier to delete.
 * @param {string} token - The admin's JWT.
 */
const remove = async (id, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.delete(`/${id}`);
    return response.data;
};


const supplierService = {
    getAll,
    create,
    update,
    remove,
};

export default supplierService;
