// src/pages/SupplierManager.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import supplierService from '../services/supplierService';

// Modal Styling
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalContentStyle = {
    background: 'white', padding: '2rem', borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '100%', maxWidth: '600px',
};

const SupplierManager = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [addFormData, setAddFormData] = useState({ name: '', contactName: '', phone: '', email: '', address: '', leadTimeDays: '', rating: '' });
    const [editFormData, setEditFormData] = useState(null);
    const [supplierToEdit, setSupplierToEdit] = useState(null);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { token } = useAuth();

    // Fetch all suppliers when the component mounts
    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await supplierService.getAll(token);
            setSuppliers(data);
        } catch (err) {
            setError('Failed to fetch suppliers. Please try again.');
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
        try {
            await supplierService.create(addFormData, token);
            await fetchData();
            setMessage('Supplier created successfully!');
            setAddFormData({ name: '', contactName: '', phone: '', email: '', address: '', leadTimeDays: '', rating: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create supplier.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await supplierService.update(supplierToEdit._id, editFormData, token);
            await fetchData();
            setMessage('Supplier updated successfully!');
            setSupplierToEdit(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update supplier.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const handleDelete = async (id) => {
        try {
            await supplierService.remove(id, token);
            setSuppliers(prev => prev.filter(s => s._id !== id));
            setMessage('Supplier deleted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete supplier.');
        } finally {
            setSupplierToDelete(null);
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const openEditModal = (supplier) => {
        setSupplierToEdit(supplier);
        setEditFormData({ ...supplier });
    };

    const listStyle = { listStyleType: 'none', padding: 0 };
    const listItemStyle = { background: '#f4f4f4', margin: '10px 0', padding: '15px', borderRadius: '8px' };

    return (
        <div className="container" style={{maxWidth: '1200px'}}>
            <h2>Manage Suppliers</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {/* Add Supplier Form */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>Add New Supplier</h4>
                <form onSubmit={handleAddSubmit}>
                    <div className="form-group">
                        <label>Supplier Name</label>
                        <input type="text" name="name" value={addFormData.name} onChange={handleAddFormChange} required />
                    </div>
                    <div className="form-group">
                        <label>Contact Name</label>
                        <input type="text" name="contactName" value={addFormData.contactName} onChange={handleAddFormChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" name="phone" value={addFormData.phone} onChange={handleAddFormChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={addFormData.email} onChange={handleAddFormChange} />
                    </div>
                    <button type="submit" className="btn">Add Supplier</button>
                </form>
            </div>

            {/* Suppliers List */}
            <h4>Existing Suppliers</h4>
            {loading ? <p>Loading...</p> : (
                <ul style={listStyle}>
                    {suppliers.map(s => (
                        <li key={s._id} style={listItemStyle}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                    <strong>{s.name}</strong>
                                    <br />
                                    <small>{s.email} | Phone: {s.phone || 'N/A'}</small>
                                </div>
                                <div>
                                    <button onClick={() => openEditModal(s)} style={{marginRight: '10px', backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                                    <button onClick={() => setSupplierToDelete(s)} style={{backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Edit Modal */}
            {supplierToEdit && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4>Edit Supplier</h4>
                        <form onSubmit={handleUpdateSubmit}>
                            <div style={{maxHeight: '60vh', overflowY: 'auto', padding: '0 1rem'}}>
                                <div className="form-group"><label>Name</label><input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} required /></div>
                                <div className="form-group"><label>Contact Name</label><input type="text" name="contactName" value={editFormData.contactName} onChange={handleEditFormChange} /></div>
                                <div className="form-group"><label>Phone</label><input type="text" name="phone" value={editFormData.phone} onChange={handleEditFormChange} /></div>
                                <div className="form-group"><label>Email</label><input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} /></div>
                                <div className="form-group"><label>Address</label><input type="text" name="address" value={editFormData.address} onChange={handleEditFormChange} /></div>
                                <div className="form-group"><label>Lead Time (Days)</label><input type="number" name="leadTimeDays" value={editFormData.leadTimeDays} onChange={handleEditFormChange} /></div>
                                <div className="form-group"><label>Rating (1-5)</label><input type="number" name="rating" min="1" max="5" value={editFormData.rating} onChange={handleEditFormChange} /></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setSupplierToEdit(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                                <button type="submit" className="btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {supplierToDelete && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete the supplier "<strong>{supplierToDelete.name}</strong>"?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setSupplierToDelete(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                            <button onClick={() => handleDelete(supplierToDelete._id)} className="btn" style={{backgroundColor: '#dc3545'}}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierManager;
