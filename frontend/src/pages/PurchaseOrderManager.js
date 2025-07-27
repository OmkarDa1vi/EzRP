// src/pages/PurchaseOrderManager.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import { useAuth } from '../context/AuthContext';
import purchaseOrderService from '../services/purchaseOrderService';

const PurchaseOrderManager = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { token } = useAuth();

    useEffect(() => {
        const fetchPOs = async () => {
            try {
                const data = await purchaseOrderService.getAll(token);
                setPurchaseOrders(data);
            } catch (err) {
                setError('Failed to fetch purchase orders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPOs();
    }, [token]);

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'draft': return '#6c757d'; // Gray
            case 'pending': return '#ffc107'; // Yellow
            case 'received': return '#28a745'; // Green
            case 'cancelled': return '#dc3545'; // Red
            default: return '#6c757d';
        }
    };

    const listStyle = { listStyleType: 'none', padding: 0 };
    const listItemStyle = { background: '#f8f9fa', margin: '10px 0', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' };
    const itemHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
    const statusBadgeStyle = (status) => ({
        backgroundColor: getStatusBadgeColor(status),
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    });

    if (loading) {
        return <div className="container"><p>Loading Purchase Orders...</p></div>;
    }

    if (error) {
        return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;
    }

    return (
        <div className="container" style={{maxWidth: '1200px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Manage Purchase Orders</h2>
                {/* --- UPDATED BUTTON --- */}
                <Link to="/admin/pos/create" className="btn" style={{ textDecoration: 'none' }}>
                    Create New PO
                </Link>
            </div>
            <p>Here you can view, create, and manage purchase orders.</p>

            {/* PO List */}
            <div style={{ marginTop: '2rem' }}>
                {purchaseOrders.length === 0 ? (
                    <p>No purchase orders found. Create one to get started!</p>
                ) : (
                    <ul style={listStyle}>
                        {purchaseOrders.map(po => (
                            <li key={po._id} style={listItemStyle}>
                                <div style={itemHeaderStyle}>
                                    <div>
                                        <strong style={{fontSize: '1.2rem'}}>PO #{po._id.substring(po._id.length - 6)}</strong>
                                        <br/>
                                        <small style={{color: '#555'}}>
                                            Supplier: {po.supplierId?.name || 'N/A'} | 
                                            Order Date: {new Date(po.orderDate).toLocaleDateString()}
                                        </small>
                                    </div>
                                    <span style={statusBadgeStyle(po.status)}>{po.status}</span>
                                </div>
                                <div>
                                    <span>Total: <strong>${po.totalAmount.toFixed(2)}</strong></span>
                                    <span style={{marginLeft: '20px'}}>Items: <strong>{po.items.length}</strong></span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default PurchaseOrderManager;
