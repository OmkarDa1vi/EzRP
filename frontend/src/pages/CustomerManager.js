// src/pages/CustomerManager.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import customerService from '../services/customerService';

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

const CustomerManager = () => {
    const [customers, setCustomers] = useState([]);
    const [addFormData, setAddFormData] = useState({ name: '', phone: '', email: '', address: '', loyaltyPoints: 0, taxExempt: false });
    const [editFormData, setEditFormData] = useState(null);
    const [customerToEdit, setCustomerToEdit] = useState(null);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { token } = useAuth();

    // Fetch all customers when the component mounts
    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await customerService.getAll(token);
            setCustomers(data);
        } catch (err) {
            setError('Failed to fetch customers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    // --- Input Handlers ---
    const handleAddFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // --- Submit Handlers ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await customerService.create(addFormData, token);
            await fetchData();
            setMessage('Customer created successfully!');
            setAddFormData({ name: '', phone: '', email: '', address: '', loyaltyPoints: 0, taxExempt: false });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create customer.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await customerService.update(customerToEdit._id, editFormData, token);
            await fetchData();
            setMessage('Customer updated successfully!');
            setCustomerToEdit(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update customer.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const handleDelete = async (id) => {
        try {
            await customerService.remove(id, token);
            setCustomers(prev => prev.filter(c => c._id !== id));
            setMessage('Customer deleted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete customer.');
        } finally {
            setCustomerToDelete(null);
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const openEditModal = (customer) => {
        setCustomerToEdit(customer);
        setEditFormData({ ...customer });
    };

    const listStyle = { listStyleType: 'none', padding: 0 };
    const listItemStyle = { background: '#f4f4f4', margin: '10px 0', padding: '15px', borderRadius: '8px' };

    return (
        <div className="container" style={{maxWidth: '1200px'}}>
            <h2>Manage Customers</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {/* Add Customer Form */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>Add New Customer</h4>
                <form onSubmit={handleAddSubmit}>
                    <div className="form-group"><label>Customer Name</label><input type="text" name="name" value={addFormData.name} onChange={handleAddFormChange} required /></div>
                    <div className="form-group"><label>Phone</label><input type="text" name="phone" value={addFormData.phone} onChange={handleAddFormChange} /></div>
                    <div className="form-group"><label>Email</label><input type="email" name="email" value={addFormData.email} onChange={handleAddFormChange} /></div>
                    <button type="submit" className="btn">Add Customer</button>
                </form>
            </div>

            {/* Customers List */}
            <h4>Existing Customers</h4>
            {loading ? <p>Loading...</p> : (
                <ul style={listStyle}>
                    {customers.map(c => (
                        <li key={c._id} style={listItemStyle}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div><strong>{c.name}</strong><br /><small>{c.email} | Phone: {c.phone || 'N/A'}</small></div>
                                <div>
                                    <button onClick={() => openEditModal(c)} style={{marginRight: '10px', backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                                    <button onClick={() => setCustomerToDelete(c)} style={{backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Edit Modal */}
            {customerToEdit && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4>Edit Customer</h4>
                        <form onSubmit={handleUpdateSubmit}>
                            <div style={{maxHeight: '60vh', overflowY: 'auto', padding: '0 1rem'}}>
                                <div className="form-group"><label>Name</label><input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} required /></div>
                                <div className="form-group"><label>Phone</label><input type="text" name="phone" value={editFormData.phone} onChange={handleEditFormChange} /></div>
                                <div className="form-group"><label>Email</label><input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} /></div>
                                <div className="form-group"><label>Address</label><input type="text" name="address" value={editFormData.address} onChange={handleEditFormChange} /></div>
                                <div className="form-group"><label>Loyalty Points</label><input type="number" name="loyaltyPoints" value={editFormData.loyaltyPoints} onChange={handleEditFormChange} /></div>
                                <div className="form-group" style={{display: 'flex', alignItems: 'center'}}><input type="checkbox" name="taxExempt" checked={editFormData.taxExempt} onChange={handleEditFormChange} style={{width: 'auto', marginRight: '10px'}} /><label>Tax Exempt</label></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setCustomerToEdit(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                                <button type="submit" className="btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {customerToDelete && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete the customer "<strong>{customerToDelete.name}</strong>"?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setCustomerToDelete(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                            <button onClick={() => handleDelete(customerToDelete._id)} className="btn" style={{backgroundColor: '#dc3545'}}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManager;
