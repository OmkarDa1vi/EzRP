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
                    <Link to="/admin/fields" className="btn" style={{ textDecoration: 'none', backgroundColor: '#17a2b8' }}>
                        Manage Product Fields
                    </Link>
                    <Link to="/admin/categories" className="btn" style={{ textDecoration: 'none', backgroundColor: '#28a745' }}>
                        Manage Categories
                    </Link>
                    {/* We can add links to other admin tools here in the future */}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
