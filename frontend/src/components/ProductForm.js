// src/components/ProductForm.js

import React, { useState, useEffect } from 'react';

const ProductForm = ({ initialData, onSubmit, activeFields, categories, isEditing = false }) => {
    const [formData, setFormData] = useState({});

    // This effect populates the form when initialData (for editing) is provided.
    useEffect(() => {
        // We initialize all possible fields to avoid uncontrolled input warnings.
        const allFields = {
            sku: '', name: '', description: '', categoryId: '', productType: 'standard',
            brand: '', supplierSku: '', unit: 'pcs', weight: '',
            dimensions: { length: '', width: '', height: '' },
            b2cPrice: '', b2bPrice: '', costPrice: '', purchaseTaxRate: '', salesTaxRate: '',
            taxCategory: '', expiryDate: '', manufactureDate: '', shelfLifeDays: '',
            storageConditions: '', lotNumber: '', serialNumbers: '', minOrderQty: '1',
            maxOrderQty: '', reorderLevel: '', attributes: [], tags: '', images: '', videos: '',
            status: 'active',
        };
        setFormData({ ...allFields, ...initialData });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDimensionChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, [name]: value }
        }));
    };
    
    // A simple handler for array fields based on comma-separated values
    const handleArrayChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value.split(',').map(item => item.trim()) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Helper to render form groups conditionally
    const renderField = (fieldName, label, children) => {
        if (!activeFields.includes(fieldName)) return null;
        return (
            <div className="form-group">
                <label>{label}</label>
                {children}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0 1rem' }}>
                {renderField('sku', 'SKU', <input type="text" name="sku" value={formData.sku || ''} onChange={handleChange} required />)}
                {renderField('name', 'Product Name', <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />)}
                {renderField('description', 'Description', <textarea name="description" value={formData.description || ''} onChange={handleChange} />)}
                {renderField('categoryId', 'Category', (
                    <select name="categoryId" value={formData.categoryId || ''} onChange={handleChange} required>
                        <option value="">-- Select Category --</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                ))}
                {renderField('productType', 'Product Type', (
                    <select name="productType" value={formData.productType || 'standard'} onChange={handleChange}>
                        <option value="standard">Standard</option>
                        <option value="bundle">Bundle</option>
                        <option value="service">Service</option>
                        <option value="subscription">Subscription</option>
                    </select>
                ))}
                {renderField('brand', 'Brand', <input type="text" name="brand" value={formData.brand || ''} onChange={handleChange} />)}
                {renderField('b2cPrice', 'Retail Price (B2C)', <input type="number" name="b2cPrice" value={formData.b2cPrice || ''} onChange={handleChange} required />)}
                {renderField('b2bPrice', 'Wholesale Price (B2B)', <input type="number" name="b2bPrice" value={formData.b2bPrice || ''} onChange={handleChange} />)}
                {renderField('costPrice', 'Cost Price', <input type="number" name="costPrice" value={formData.costPrice || ''} onChange={handleChange} />)}
                {renderField('status', 'Status', (
                    <select name="status" value={formData.status || 'active'} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="discontinued">Discontinued</option>
                    </select>
                ))}
                {renderField('tags', 'Tags (comma-separated)', <input type="text" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))} />)}
                {/* Add other fields here following the same pattern */}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                <button type="button" onClick={() => onSubmit(null)} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                <button type="submit" className="btn">{isEditing ? 'Save Changes' : 'Add Product'}</button>
            </div>
        </form>
    );
};

export default ProductForm;
