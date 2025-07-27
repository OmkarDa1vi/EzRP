// src/pages/AdminDashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useAuth();
    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Admin Dashboard</h2>
                <button onClick={logout} className="btn" style={{ backgroundColor: '#6c757d', width: 'auto' }}>Logout</button>
            </div>
            
            <p>Welcome, Admin! You have special privileges.</p>

            <div style={{ marginTop: '2rem' }}>
                <h4>Admin Tools</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                    <Link to="/admin/salesorders" className="btn" style={{ textDecoration: 'none', backgroundColor: '#6610f2' }}>
                        Manage Sales Orders
                    </Link>
                    <Link to="/admin/products" className="btn" style={{ textDecoration: 'none', backgroundColor: '#007bff' }}>
                        Manage Products
                    </Link>
                    <Link to="/admin/pos" className="btn" style={{ textDecoration: 'none', backgroundColor: '#6f42c1' }}>
                        Manage Purchase Orders
                    </Link>
                    <Link to="/admin/suppliers" className="btn" style={{ textDecoration: 'none', backgroundColor: '#e83e8c' }}>
                        Manage Suppliers
                    </Link>
                    <Link to="/admin/customers" className="btn" style={{ textDecoration: 'none', backgroundColor: '#20c997' }}>
                        Manage Customers
                    </Link>
                    <Link to="/admin/roles" className="btn" style={{ textDecoration: 'none', backgroundColor: '#dc3545' }}>
                        Manage Roles & Permissions
                    </Link>
                    <Link to="/admin/auditlogs" className="btn" style={{ textDecoration: 'none', backgroundColor: '#343a40' }}>
                        View Audit Logs
                    </Link>
                    <Link to="/admin/fields" className="btn" style={{ textDecoration: 'none', backgroundColor: '#17a2b8' }}>
                        Manage Product Fields
                    </Link>
                    <Link to="/admin/categories" className="btn" style={{ textDecoration: 'none', backgroundColor: '#28a745' }}>
                        Manage Categories
                    </Link>
                    <Link to="/admin/warehouses" className="btn" style={{ textDecoration: 'none', backgroundColor: '#fd7e14' }}>
                        Manage Warehouses
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
