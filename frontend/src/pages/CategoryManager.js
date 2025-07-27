// src/pages/CategoryManager.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import categoryService from '../services/categoryService';

// --- Modal Styling (reused for both modals) ---
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalContentStyle = {
    background: 'white', padding: '2rem', borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '100%', maxWidth: '500px',
};


const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [addFormData, setAddFormData] = useState({ name: '', parentId: '', tags: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // --- NEW: State for Edit and Delete Modals ---
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState(null);

    const { token } = useAuth();

    // --- Fetch Categories ---
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAll(token);
            setCategories(data);
        } catch (err) {
            setError('Failed to fetch categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    // --- Input Handlers ---
    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Form Submit Handlers ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const tagsArray = addFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            const postData = {
                name: addFormData.name,
                parentId: addFormData.parentId || null,
                tags: tagsArray,
            };
            await categoryService.create(postData, token);
            await fetchCategories(); // Re-fetch to get the latest list with populated data
            setMessage('Category created successfully!');
            setAddFormData({ name: '', parentId: '', tags: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create category.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const tagsArray = editFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            const updateData = {
                name: editFormData.name,
                parentId: editFormData.parentId || null,
                tags: tagsArray,
            };
            await categoryService.update(categoryToEdit._id, updateData, token);
            await fetchCategories(); // Re-fetch to get updated list
            setMessage('Category updated successfully!');
            setCategoryToEdit(null); // Close the modal
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update category.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };

    // --- Delete Handler ---
    const handleDelete = async (id) => {
        try {
            await categoryService.remove(id, token);
            setCategories(prev => prev.filter(cat => cat._id !== id));
            setMessage('Category deleted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete category.');
        } finally {
            setCategoryToDelete(null);
            setTimeout(() => { setMessage(''); setError(''); }, 3000);
        }
    };
    
    // --- NEW: Function to open the edit modal ---
    const openEditModal = (category) => {
        setCategoryToEdit(category);
        setEditFormData({
            name: category.name,
            parentId: category.parentId ? category.parentId._id : '',
            tags: category.tags.join(', '), // Convert array to comma-separated string for editing
        });
    };

    const listStyle = { listStyleType: 'none', padding: 0 };
    const listItemStyle = { background: '#f4f4f4', margin: '5px 0', padding: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

    return (
        <div className="container">
            <h2>Manage Categories</h2>

            {/* Add Category Form */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>Add New Category</h4>
                <form onSubmit={handleAddSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={addFormData.name} onChange={handleAddFormChange} required />
                    </div>
                    <div className="form-group">
                        <label>Parent Category (optional)</label>
                        <select name="parentId" value={addFormData.parentId} onChange={handleAddFormChange} >
                            <option value="">-- None (Top-Level) --</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Tags (comma-separated)</label>
                        <input type="text" name="tags" value={addFormData.tags} onChange={handleAddFormChange} />
                    </div>
                    <button type="submit" className="btn">Add Category</button>
                </form>
            </div>

            {/* Category List */}
            <h4>Existing Categories</h4>
            {loading ? <p>Loading...</p> : (
                <ul style={listStyle}>
                    {categories.map(cat => (
                        <li key={cat._id} style={listItemStyle}>
                            <span>
                                {cat.name} 
                                {cat.parentId && <small style={{ color: '#555' }}> (Parent: {cat.parentId.name})</small>}
                            </span>
                            <div>
                                <button onClick={() => openEditModal(cat)} style={{marginRight: '10px', backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                                <button onClick={() => setCategoryToDelete(cat)} style={{backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* --- NEW: Edit Category Modal --- */}
            {categoryToEdit && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4>Edit Category</h4>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>Parent Category</label>
                                <select name="parentId" value={editFormData.parentId} onChange={handleEditFormChange}>
                                    <option value="">-- None --</option>
                                    {categories.filter(c => c._id !== categoryToEdit._id).map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tags (comma-separated)</label>
                                <input type="text" name="tags" value={editFormData.tags} onChange={handleEditFormChange} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setCategoryToEdit(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                                <button type="submit" className="btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {categoryToDelete && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete the category "<strong>{categoryToDelete.name}</strong>"?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setCategoryToDelete(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                            <button onClick={() => handleDelete(categoryToDelete._id)} className="btn" style={{backgroundColor: '#dc3545'}}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
