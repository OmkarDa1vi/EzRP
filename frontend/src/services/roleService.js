// src/services/roleService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/roles/';

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
 * Fetches all roles.
 * @param {string} token - The admin's JWT.
 */
const getAll = async (token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.get('/');
    return response.data;
};

/**
 * Creates a new role.
 * @param {object} roleData - The data for the new role { name, description, permissions }.
 * @param {string} token - The admin's JWT.
 */
const create = async (roleData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.post('/', roleData);
    return response.data;
};

/**
 * Updates an existing role.
 * @param {string} id - The ID of the role to update.
 * @param {object} roleData - The updated data for the role.
 * @param {string} token - The admin's JWT.
 */
const update = async (id, roleData, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.put(`/${id}`, roleData);
    return response.data;
};

/**
 * Deletes a role.
 * @param {string} id - The ID of the role to delete.
 * @param {string} token - The admin's JWT.
 */
const remove = async (id, token) => {
    const apiClient = getAuthApiClient(token);
    const response = await apiClient.delete(`/${id}`);
    return response.data;
};


const roleService = {
    getAll,
    create,
    update,
    remove,
};

export default roleService;
