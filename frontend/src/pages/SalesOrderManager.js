// src/pages/SalesOrderManager.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import { useAuth } from '../context/AuthContext';
import salesOrderService from '../services/salesOrderService';

const SalesOrderManager = () => {
    const [salesOrders, setSalesOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { token } = useAuth();

    useEffect(() => {
        const fetchSOs = async () => {
            try {
                const data = await salesOrderService.getAll(token);
                setSalesOrders(data);
            } catch (err) {
                setError('Failed to fetch sales orders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSOs();
    }, [token]);

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'draft': return '#6c757d'; // Gray
            case 'paid': return '#28a745'; // Green
            case 'cancelled': return '#dc3545'; // Red
            case 'returned': return '#ffc107'; // Yellow
            default: return '#6c757d';
        }
    };
    
    const getShipmentStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107'; // Yellow
            case 'shipped': return '#17a2b8'; // Teal
            case 'delivered': return '#28a745'; // Green
            default: return '#6c757d';
        }
    };

    const listStyle = { listStyleType: 'none', padding: 0 };
    const listItemStyle = { background: '#f8f9fa', margin: '10px 0', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' };
    const itemHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
    const statusBadgeStyle = (bgColor) => ({
        backgroundColor: bgColor,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginLeft: '10px',
    });

    if (loading) {
        return <div className="container"><p>Loading Sales Orders...</p></div>;
    }

    if (error) {
        return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;
    }

    return (
        <div className="container" style={{maxWidth: '1200px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Manage Sales Orders</h2>
                {/* --- UPDATED BUTTON --- */}
                <Link to="/admin/salesorders/create" className="btn" style={{ textDecoration: 'none' }}>
                    Create New Sales Order
                </Link>
            </div>
            <p>Here you can view, create, and manage customer sales orders.</p>

            {/* SO List */}
            <div style={{ marginTop: '2rem' }}>
                {salesOrders.length === 0 ? (
                    <p>No sales orders found. Create one to get started!</p>
                ) : (
                    <ul style={listStyle}>
                        {salesOrders.map(so => (
                            <li key={so._id} style={listItemStyle}>
                                <div style={itemHeaderStyle}>
                                    <div>
                                        <strong style={{fontSize: '1.2rem'}}>SO #{so._id.substring(so._id.length - 6)}</strong>
                                        <br/>
                                        <small style={{color: '#555'}}>
                                            Customer: {so.customerId?.name || 'N/A'} | 
                                            Order Date: {new Date(so.orderDate).toLocaleDateString()}
                                        </small>
                                    </div>
                                    <div>
                                        <span style={statusBadgeStyle(getShipmentStatusBadgeColor(so.shipmentStatus))}>{so.shipmentStatus}</span>
                                        <span style={statusBadgeStyle(getStatusBadgeColor(so.status))}>{so.status}</span>
                                    </div>
                                </div>
                                <div>
                                    <span>Total: <strong>${so.totalAmount.toFixed(2)}</strong></span>
                                    <span style={{marginLeft: '20px'}}>Items: <strong>{so.items.length}</strong></span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SalesOrderManager;
