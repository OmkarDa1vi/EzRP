// src/pages/ProductManager.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import configService from '../services/configService';
import ProductForm from '../components/ProductForm';

// Modal Styling
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalContentStyle = {
    background: 'white', padding: '2rem', borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '100%', maxWidth: '700px',
};


const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeFields, setActiveFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);

    const { token } = useAuth();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData, configData] = await Promise.all([
                productService.getAll(token),
                categoryService.getAll(token),
                configService.getFieldConfig(token)
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setActiveFields(configData.activeFields);
        } catch (err) {
            setError('Failed to fetch required data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleOpenAddModal = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    const handleFormSubmit = async (formData) => {
        if (!formData) {
            handleCloseModal();
            return;
        }

        // --- FIXED: Add validation check here ---
        if (!formData.categoryId) {
            alert('Please select a category for the product.');
            return; // Stop the submission
        }

        try {
            if (currentProduct) {
                await productService.update(currentProduct._id, formData, token);
                setMessage('Product updated successfully!');
            } else {
                await productService.create(formData, token);
                setMessage('Product added successfully!');
            }
            await fetchData();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setTimeout(() => { setMessage(''); setError(''); }, 4000);
        }
    };

    const handleDelete = async (id) => {
        try {
            await productService.remove(id, token);
            setMessage('Product deleted successfully!');
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete product.');
        } finally {
            setProductToDelete(null);
            setTimeout(() => { setMessage(''); setError(''); }, 4000);
        }
    };
    
    // ... (rest of the component JSX remains the same)
    const listStyle = { listStyleType: 'none', padding: 0 };
    const listItemStyle = { background: '#f4f4f4', margin: '10px 0', padding: '15px', borderRadius: '8px' };
    const itemHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };

    return (
        <div className="container" style={{maxWidth: '1200px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Manage Products</h2>
                <button onClick={handleOpenAddModal} className="btn">Add New Product</button>
            </div>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {/* Product List */}
            <div style={{ marginTop: '2rem' }}>
                {loading ? <p>Loading...</p> : products.length === 0 ? (
                    <p>No products found. Add one to get started!</p>
                ) : (
                    <ul style={listStyle}>
                        {products.map(product => (
                            <li key={product._id} style={listItemStyle}>
                                <div style={itemHeaderStyle}>
                                    <div>
                                        <strong style={{fontSize: '1.2rem'}}>{product.name}</strong>
                                        <br/>
                                        <small style={{color: '#555'}}>SKU: {product.sku} | Category: {product.categoryId?.name || 'N/A'}</small>
                                    </div>
                                    <div>
                                        <button onClick={() => handleOpenEditModal(product)} style={{marginRight: '10px', backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                                        <button onClick={() => setProductToDelete(product)} style={{backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                                    </div>
                                </div>
                                <p>{product.description || 'No description available.'}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* --- Add/Edit Modal --- */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <ProductForm
                            initialData={currentProduct}
                            onSubmit={handleFormSubmit}
                            activeFields={activeFields}
                            categories={categories}
                            isEditing={!!currentProduct}
                        />
                    </div>
                </div>
            )}

            {/* --- Delete Confirmation Modal --- */}
            {productToDelete && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete the product "<strong>{productToDelete.name}</strong>"?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setProductToDelete(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                            <button onClick={() => handleDelete(productToDelete._id)} className="btn" style={{backgroundColor: '#dc3545'}}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
