// src/pages/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import { FaPlusCircle, FaDollarSign, FaUsers, FaBox, FaArrowRight } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css'; 

// A reusable component for the main statistic cards
const StatCard = ({ title, value, icon, color }) => (
    <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: color }}>
            {icon}
        </div>
        <div className="stat-info">
            <span className="stat-title">{title}</span>
            <span className="stat-value">{value}</span>
        </div>
    </div>
);

// A reusable component for the "Quick Link" buttons
const QuickLink = ({ to, text, icon }) => (
    <Link to={to} className="quick-link">
        {icon}
        <span>{text}</span>
    </Link>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats(token);
                // Format month data for the chart
                const formattedChartData = data.salesByMonth.map(item => ({
                    name: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
                    Sales: item.totalSales,
                }));
                setStats({ ...data, formattedChartData });
            } catch (err) {
                setError('Failed to load dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) {
        return <div className="dashboard-loading">Loading Dashboard...</div>;
    }
    if (error) {
        return <div className="dashboard-error">{error}</div>;
    }

    return (
        <div className="admin-dashboard">
            {/* Quick Links Section */}
            <div className="dashboard-section">
                <h3 className="section-title">Quick Links</h3>
                <div className="quick-links-container">
                    <QuickLink to="/admin/salesorders/create" text="Create Sale" icon={<FaPlusCircle />} />
                    <QuickLink to="/admin/pos/create" text="Create Purchase" icon={<FaPlusCircle />} />
                    <QuickLink to="/admin/products" text="Create Product" icon={<FaPlusCircle />} />
                </div>
            </div>

            {/* Statistics Cards Section */}
            <div className="dashboard-section">
                <div className="stats-grid">
                    <StatCard title="Total Sales" value={`$${stats?.totalSales.toFixed(2)}`} icon={<FaDollarSign />} color="#28a745" />
                    <StatCard title="Total Customers" value={stats?.totalCustomers} icon={<FaUsers />} color="#007bff" />
                    <StatCard title="Total Products" value={stats?.totalProducts} icon={<FaBox />} color="#ffc107" />
                    <StatCard title="Total Purchase Due" value="$0.00" icon={<FaDollarSign />} color="#dc3545" /> 
                </div>
            </div>
            
            {/* --- Management Tools Section --- */}
            <div className="dashboard-section">
                <h3 className="section-title">Management Tools</h3>
                <div className="management-links-grid">
                    <Link to="/admin/products" className="management-link">Manage Products <FaArrowRight /></Link>
                    <Link to="/admin/salesorders" className="management-link">Manage Sales Orders <FaArrowRight /></Link>
                    <Link to="/admin/pos" className="management-link">Manage Purchase Orders <FaArrowRight /></Link>
                    <Link to="/admin/customers" className="management-link">Manage Customers <FaArrowRight /></Link>
                    <Link to="/admin/suppliers" className="management-link">Manage Suppliers <FaArrowRight /></Link>
                    <Link to="/admin/categories" className="management-link">Manage Categories <FaArrowRight /></Link>
                    <Link to="/admin/warehouses" className="management-link">Manage Warehouses <FaArrowRight /></Link>
                    <Link to="/admin/roles" className="management-link">Manage Roles & Permissions <FaArrowRight /></Link>
                    <Link to="/admin/fields" className="management-link">Manage Product Fields <FaArrowRight /></Link>
                    <Link to="/admin/auditlogs" className="management-link">View Audit Logs <FaArrowRight /></Link>
                </div>
            </div>
            {/* --- End Management Tools Section --- */}

            {/* Charts and Recent Activity Section */}
            <div className="dashboard-grid">
                <div className="dashboard-section chart-container">
                    <h3 className="section-title">Sales Overview (Last 12 Months)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats?.formattedChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="dashboard-section recent-sales-container">
                    <h3 className="section-title">Recent Sales</h3>
                    <ul className="recent-list">
                        {stats?.recentSales.map(sale => (
                            <li key={sale._id}>
                                <span>{sale.customerId?.name || 'N/A'}</span>
                                <span>${sale.totalAmount.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
