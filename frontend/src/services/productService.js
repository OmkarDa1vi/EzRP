// src/services/productService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/products/';

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
 * Fetches all products.
 * @param {string} token - The admin's JWT.
 */
const getAll = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/');
    return response.data;
};

/**
 * Creates a new product.
 * @param {object} productData - The data for the new product.
 * @param {string} token - The admin's JWT.
 */
const create = async (productData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.post('/', productData);
    return response.data;
};

/**
 * Updates an existing product.
 * @param {string} id - The ID of the product to update.
 * @param {object} productData - The updated data for the product.
 * @param {string} token - The admin's JWT.
 */
const update = async (id, productData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.put(`/${id}`, productData);
    return response.data;
};

/**
 * Deletes a product.
 * @param {string} id - The ID of the product to delete.
 * @param {string} token - The admin's JWT.
 */
const remove = async (id, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.delete(`/${id}`);
    return response.data;
};


const productService = {
    getAll,
    create,
    update,
    remove,
};

export default productService;
