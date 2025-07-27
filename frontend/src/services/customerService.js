// src/services/customerService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/customers/';

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
 * Fetches all customers.
 * @param {string} token - The admin's JWT.
 */
const getAll = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/');
    return response.data;
};

/**
 * Creates a new customer.
 * @param {object} customerData - The data for the new customer.
 * @param {string} token - The admin's JWT.
 */
const create = async (customerData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.post('/', customerData);
    return response.data;
};

/**
 * Updates an existing customer.
 * @param {string} id - The ID of the customer to update.
 * @param {object} customerData - The updated data for the customer.
 * @param {string} token - The admin's JWT.
 */
const update = async (id, customerData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.put(`/${id}`, customerData);
    return response.data;
};

/**
 * Deletes a customer.
 * @param {string} id - The ID of the customer to delete.
 * @param {string} token - The admin's JWT.
 */
const remove = async (id, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.delete(`/${id}`);
    return response.data;
};


const customerService = {
    getAll,
    create,
    update,
    remove,
};

export default customerService;
