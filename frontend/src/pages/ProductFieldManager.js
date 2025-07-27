// src/pages/ProductFieldManager.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import configService from '../services/configService';

// The master list of all available fields, matching the backend model.
const ALL_PRODUCT_FIELDS = [
    'id', 'sku', 'name', 'description', 'categoryId', 'productType', 'brand', 
    'supplierSku', 'unit', 'weight', 'dimensions', 'b2cPrice', 'b2bPrice', 
    'costPrice', 'purchaseTaxRate', 'salesTaxRate', 'taxCategory', 'expiryDate', 
    'manufactureDate', 'shelfLifeDays', 'storageConditions', 'lotNumber', 
    'serialNumbers', 'minOrderQty', 'maxOrderQty', 'reorderLevel', 'attributes', 
    'tags', 'images', 'videos', 'status', 'createdAt', 'updatedAt'
];

// Styling for the checkbox grid
const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
};

const checkboxLabelStyles = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
    cursor: 'pointer',
};

const ProductFieldManager = () => {
    const [activeFields, setActiveFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { token } = useAuth();

    // Fetch the current configuration when the component mounts
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await configService.getFieldConfig(token);
                setActiveFields(config.activeFields);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch configuration.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, [token]);

    // Handles toggling a checkbox
    const handleCheckboxChange = (field) => {
        setActiveFields(prevFields => 
            prevFields.includes(field)
                ? prevFields.filter(f => f !== field) // Remove field if it's already there
                : [...prevFields, field] // Add field if it's not
        );
    };

    // Handles saving the new configuration
    const handleSaveChanges = async () => {
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await configService.updateFieldConfig(activeFields, token);
            setMessage('Configuration saved successfully!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save configuration.';
            setError(errorMessage);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading && activeFields.length === 0) {
        return <div className="container"><p>Loading configuration...</p></div>;
    }

    return (
        <div className="container">
            <h2>Manage Product Fields</h2>
            <p>Select the fields you want to be available when adding or editing products.</p>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            <div style={gridStyles}>
                {ALL_PRODUCT_FIELDS.map(field => (
                    <label key={field} style={checkboxLabelStyles}>
                        <input
                            type="checkbox"
                            checked={activeFields.includes(field)}
                            onChange={() => handleCheckboxChange(field)}
                            style={{ marginRight: '0.5rem' }}
                        />
                        {field}
                    </label>
                ))}
            </div>

            <button onClick={handleSaveChanges} className="btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
};

export default ProductFieldManager;
