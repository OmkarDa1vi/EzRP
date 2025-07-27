// src/components/RoleForm.js

import React from 'react';

// This should be the single source of truth for all permissions in the system
const ALL_PERMISSIONS = [
    'MANAGE_PRODUCTS', 'MANAGE_CATEGORIES', 'MANAGE_WAREHOUSES',
    'MANAGE_SUPPLIERS', 'MANAGE_CUSTOMERS', 'MANAGE_PURCHASE_ORDERS',
    'MANAGE_SALES_ORDERS', 'MANAGE_USERS', 'MANAGE_SETTINGS',
    'MANAGE_ROLES', 'VIEW_DASHBOARD', 'SUBMIT_DATA'
];

const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
    maxHeight: '40vh',
    overflowY: 'auto',
    padding: '1rem',
    border: '1px solid #eee',
    borderRadius: '8px',
};

const RoleForm = ({ formData, setFormData, handleSubmit, closeModal, isEditing = false }) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (permission) => {
        setFormData(prev => {
            const newPermissions = prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission];
            return { ...prev, permissions: newPermissions };
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Role Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
            </div>
            
            <div className="form-group">
                <label>Permissions</label>
                <div style={gridStyles}>
                    {ALL_PERMISSIONS.map(permission => (
                        <label key={permission} style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={formData.permissions.includes(permission)}
                                onChange={() => handlePermissionChange(permission)}
                                style={{ marginRight: '0.5rem' }}
                            />
                            {permission}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={closeModal} className="btn" style={{backgroundColor: '#6c757d'}}>Cancel</button>
                <button type="submit" className="btn">{isEditing ? 'Save Changes' : 'Create Role'}</button>
            </div>
        </form>
    );
};

export default RoleForm;
