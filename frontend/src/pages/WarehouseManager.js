// src/pages/WarehouseManager.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import warehouseService from '../services/warehouseService';
import userService from '../services/userService'; // Import the new user service

// Modal Styling
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalContentStyle = {
    background: 'white', padding: '2rem', borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '100%', maxWidth: '500px',
};

const WarehouseManager = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [users, setUsers] = useState([]); // State for the list of users
    const [addFormData, setAddFormData] = useState({ name: '', location: '', managerId: '' });
    const [editFormData, setEditFormData] = useState(null);
    const [warehouseToEdit, setWarehouseToEdit] = useState(null);
    const [warehouseToDelete, setWarehouseToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { token } = useAuth();

    // Fetch both warehouses and users when the component mounts
    const fetchData = async () => {
        try {
            setLoading(true);
            const [warehousesData, usersData] = await Promise.all([
                warehouseService.getAll(token),
                userService.getAllUsers(token)
            ]);
            setWarehouses(warehousesData);
            setUsers(usersData);
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    // --- Input Handlers ---
    const handleAddFormChange = (e) => {
        setAddFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleEditFormChange = (e) => {
        setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // --- Submit Handlers ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!addFormData.managerId) {
            setError('Please select a manager.');
            return;
        }
        try {
            await warehouseService.create(addFormData, token);
            await fetchData(); // Refetch all data to get the latest list
            setMessage('Warehouse created successfully!');
            setAddFormData({ name: '', location: '', managerId: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create warehouse.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await warehouseService.update(warehouseToEdit._id, editFormData, token);
            await fetchData();
            setMessage('Warehouse updated successfully!');
            setWarehouseToEdit(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update warehouse.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const handleDelete = async (id) => {
        try {
            await warehouseService.remove(id, token);
            setWarehouses(prev => prev.filter(w => w._id !== id));
            setMessage('Warehouse deleted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete warehouse.');
        } finally {
            setWarehouseToDelete(null);
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const openEditModal = (warehouse) => {
        setWarehouseToEdit(warehouse);
        setEditFormData({
            name: warehouse.name,
            location: warehouse.location,
            managerId: warehouse.managerId._id,
        });
    };

    const listStyle = { listStyleType: 'none', padding: 0 };
    const listItemStyle = { background: '#f4f4f4', margin: '5px 0', padding: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

    return (
        <div className="container">
            <h2>Manage Warehouses</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {/* Add Warehouse Form */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>Add New Warehouse</h4>
                <form onSubmit={handleAddSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={addFormData.name} onChange={handleAddFormChange} required />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" name="location" value={addFormData.location} onChange={handleAddFormChange} required />
                    </div>
                    <div className="form-group">
                        <label>Manager</label>
                        <select name="managerId" value={addFormData.managerId} onChange={handleAddFormChange} required>
                            <option value="">-- Select a Manager --</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn">Add Warehouse</button>
                </form>
            </div>

            {/* Warehouses List */}
            <h4>Existing Warehouses</h4>
            {loading ? <p>Loading...</p> : (
                <ul style={listStyle}>
                    {warehouses.map(w => (
                        <li key={w._id} style={listItemStyle}>
                            <div>
                                <strong>{w.name}</strong> ({w.location})
                                <br />
                                <small>Manager: {w.managerId ? w.managerId.name : 'N/A'}</small>
                            </div>
                            <div>
                                <button onClick={() => openEditModal(w)} style={{marginRight: '10px', backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                                <button onClick={() => setWarehouseToDelete(w)} style={{backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Edit Modal */}
            {warehouseToEdit && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4>Edit Warehouse</h4>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" name="location" value={editFormData.location} onChange={handleEditFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>Manager</label>
                                <select name="managerId" value={editFormData.managerId} onChange={handleEditFormChange} required>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setWarehouseToEdit(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                                <button type="submit" className="btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {warehouseToDelete && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete the warehouse "<strong>{warehouseToDelete.name}</strong>"?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setWarehouseToDelete(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                            <button onClick={() => handleDelete(warehouseToDelete._id)} className="btn" style={{backgroundColor: '#dc3545'}}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarehouseManager;
