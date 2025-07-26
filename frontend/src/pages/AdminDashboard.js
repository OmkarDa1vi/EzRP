    // src/pages/AdminDashboard.js
    import React from 'react';
    import { useAuth } from '../context/AuthContext';

    const AdminDashboard = () => {
        const { logout } = useAuth();
        return (
            <div className="container">
                <h2>Admin Dashboard</h2>
                <p>Welcome, Admin! You have special privileges.</p>
                <button onClick={logout} className="btn" style={{backgroundColor: '#dc3545'}}>Logout</button>
            </div>
        );
    };

    export default AdminDashboard;
    