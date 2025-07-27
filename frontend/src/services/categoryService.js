// src/services/categoryService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/categories/';

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
 * Fetches all categories.
 * @param {string} token - The admin's JWT.
 */
const getAll = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/');
    return response.data;
};

/**
 * Creates a new category.
 * @param {object} categoryData - The data for the new category { name, parentId, tags }.
 * @param {string} token - The admin's JWT.
 */
const create = async (categoryData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.post('/', categoryData);
    return response.data;
};

/**
 * Updates an existing category.
 * @param {string} id - The ID of the category to update.
 * @param {object} categoryData - The updated data for the category.
 * @param {string} token - The admin's JWT.
 */
const update = async (id, categoryData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.put(`/${id}`, categoryData);
    return response.data;
};

/**
 * Deletes a category.
 * @param {string} id - The ID of the category to delete.
 * @param {string} token - The admin's JWT.
 */
const remove = async (id, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.delete(`/${id}`);
    return response.data;
};


const categoryService = {
    getAll,
    create,
    update,
    remove,
};

export default categoryService;
