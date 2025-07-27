// src/components/AdminLayout.js

import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css'; // We will create this file next

// Import icons
import { 
    FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaClipboardList, 
    FaWarehouse, FaTags, FaCog, FaSignOutAlt, FaBars, FaTimes, FaUserCircle, FaSearch 
} from 'react-icons/fa';

const AdminLayout = () => {
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const sidebarLinks = [
        { to: "/admin", icon: <FaTachometerAlt />, text: "Dashboard" },
        { to: "/admin/categories", icon: <FaTags />, text: "Categories" },
        { to: "/admin/products", icon: <FaBoxOpen />, text: "Products" },
        { to: "/admin/pos", icon: <FaClipboardList />, text: "Purchase Orders" },
        { to: "/admin/suppliers", icon: <FaUsers />, text: "Suppliers" },
        { to: "/admin/customers", icon: <FaUserCircle />, text: "Customers" },
        { to: "/admin/warehouses", icon: <FaWarehouse />, text: "Warehouses" },
        { to: "/admin/salesorders", icon: <FaShoppingCart />, text: "Sales Orders" },
        { to: "/admin/roles", icon: <FaCog />, text: "Roles & Permissions" },
        { to: "/admin/auditlogs", icon: <FaClipboardList />, text: "Audit Logs" },
    ];

    return (
        <div className="admin-layout">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h1 className="sidebar-logo">EzRP</h1>
                    <button className="sidebar-toggle-desktop" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    {sidebarLinks.map((link, index) => (
                        <NavLink key={index} to={link.to} className="sidebar-link" end>
                            {link.icon}
                            <span className="link-text">{link.text}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={logout} className="sidebar-link logout-btn">
                        <FaSignOutAlt />
                        <span className="link-text">Logout</span>
                    </button>
                </div>
            </aside>

            <div className="main-content">
                <header className="topbar">
                    <button className="sidebar-toggle-mobile" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <FaBars />
                    </button>
                </header>
                <main className="page-content">
                    {/* All our admin pages will be rendered here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
