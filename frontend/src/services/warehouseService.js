// src/services/warehouseService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/warehouses/';

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
 * Fetches all warehouses.
 * @param {string} token - The admin's JWT.
 */
const getAll = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/');
    return response.data;
};

/**
 * Creates a new warehouse.
 * @param {object} warehouseData - The data for the new warehouse { name, location, managerId }.
 * @param {string} token - The admin's JWT.
 */
const create = async (warehouseData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.post('/', warehouseData);
    return response.data;
};

/**
 * Updates an existing warehouse.
 * @param {string} id - The ID of the warehouse to update.
 * @param {object} warehouseData - The updated data for the warehouse.
 * @param {string} token - The admin's JWT.
 */
const update = async (id, warehouseData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.put(`/${id}`, warehouseData);
    return response.data;
};

/**
 * Deletes a warehouse.
 * @param {string} id - The ID of the warehouse to delete.
 * @param {string} token - The admin's JWT.
 */
const remove = async (id, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.delete(`/${id}`);
    return response.data;
};


const warehouseService = {
    getAll,
    create,
    update,
    remove,
};

export default warehouseService;
