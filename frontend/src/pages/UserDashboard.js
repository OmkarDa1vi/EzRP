// src/pages/UserDashboard.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dataService from '../services/dataService';

// Import the components we created
import DataForm from '../components/DataForm';
import DataTable from '../components/DataTable';

const UserDashboard = () => {
    const { user, token, logout } = useAuth();

    // State to hold the user's submitted data
    const [dataItems, setDataItems] = useState([]);
    // State for loading and error messages
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // This effect runs when the component mounts to fetch initial data
    useEffect(() => {
        const fetchUserItems = async () => {
            if (token) {
                try {
                    setLoading(true);
                    const items = await dataService.getData(token);
                    setDataItems(items);
                    setError('');
                } catch (err) {
                    const errorMessage = err.response?.data?.message || 'Failed to fetch data.';
                    setError(errorMessage);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserItems();
    }, [token]); // The effect depends on the token

    // This function is passed to DataForm to update the UI in real-time
    const handleNewData = (newItem) => {
        // Add the new item to the beginning of the list for immediate display
        setDataItems(prevItems => [newItem, ...prevItems]);
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>User Dashboard</h2>
                <button onClick={logout} className="btn" style={{ backgroundColor: '#6c757d', width: 'auto' }}>Logout</button>
            </div>
            
            <p>Welcome, {user?.name || 'User'}! This is your protected dashboard.</p>

            <hr style={{ margin: '2rem 0' }} />

            {/* --- Data Submission Form --- */}
            <DataForm onNewData={handleNewData} />

            <hr style={{ margin: '2rem 0' }} />

            {/* --- Data Display Table --- */}
            {loading ? (
                <p>Loading your data...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <DataTable dataItems={dataItems} />
            )}
        </div>
    );
};

export default UserDashboard;
