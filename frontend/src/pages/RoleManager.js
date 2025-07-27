// src/pages/RoleManager.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import roleService from '../services/roleService';
import RoleForm from '../components/RoleForm'; // <-- Import the new form component

// Modal Styling
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalContentStyle = {
    background: 'white', padding: '2rem', borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '100%', maxWidth: '700px',
};

const RoleManager = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // State for modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    
    // State for forms
    const [addFormData, setAddFormData] = useState({ name: '', description: '', permissions: [] });
    const [editFormData, setEditFormData] = useState(null);

    const { token } = useAuth();

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await roleService.getAll(token);
            setRoles(data);
        } catch (err) {
            setError('Failed to fetch roles.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await roleService.create(addFormData, token);
            await fetchData();
            setMessage('Role created successfully!');
            setIsAddModalOpen(false);
            setAddFormData({ name: '', description: '', permissions: [] });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create role.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };
    
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await roleService.update(editFormData._id, editFormData, token);
            await fetchData();
            setMessage('Role updated successfully!');
            setIsEditModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update role.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const handleDelete = async (id) => {
        try {
            await roleService.remove(id, token);
            setRoles(prev => prev.filter(r => r._id !== id));
            setMessage('Role deleted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete role.');
        } finally {
            setRoleToDelete(null);
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const openEditModal = (role) => {
        setEditFormData({ ...role });
        setIsEditModalOpen(true);
    };

    const listStyle = { listStyleType: 'none', padding: 0 };
    const listItemStyle = { background: '#f4f4f4', margin: '10px 0', padding: '15px', borderRadius: '8px' };

    return (
        <div className="container" style={{maxWidth: '1200px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Manage Roles & Permissions</h2>
                <button onClick={() => setIsAddModalOpen(true)} className="btn">Add New Role</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {loading ? <p>Loading...</p> : (
                <ul style={listStyle}>
                    {roles.map(role => (
                        <li key={role._id} style={listItemStyle}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div><strong>{role.name}</strong><br/><small>{role.description}</small></div>
                                {!role.isDefault && (
                                    <div>
                                        <button onClick={() => openEditModal(role)} style={{marginRight: '10px'}}>Edit</button>
                                        <button onClick={() => setRoleToDelete(role)} style={{backgroundColor: '#dc3545', color: 'white'}}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Add Role Modal */}
            {isAddModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>Add New Role</h3>
                        <RoleForm 
                            formData={addFormData}
                            setFormData={setAddFormData}
                            handleSubmit={handleAddSubmit}
                            closeModal={() => setIsAddModalOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Edit Role Modal */}
            {isEditModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>Edit Role</h3>
                        <RoleForm 
                            formData={editFormData}
                            setFormData={setEditFormData}
                            handleSubmit={handleUpdateSubmit}
                            closeModal={() => setIsEditModalOpen(false)}
                            isEditing={true}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {roleToDelete && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete the role "<strong>{roleToDelete.name}</strong>"?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setRoleToDelete(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                            <button onClick={() => handleDelete(roleToDelete._id)} className="btn" style={{backgroundColor: '#dc3545'}}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManager;
