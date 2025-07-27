// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// --- Import Page Components ---
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import Unauthorized from './pages/Unauthorized';
import ProductFieldManager from './pages/ProductFieldManager';
import CategoryManager from './pages/CategoryManager';
import WarehouseManager from './pages/WarehouseManager';
import ProductManager from './pages/ProductManager';
import SupplierManager from './pages/SupplierManager';
import PurchaseOrderManager from './pages/PurchaseOrderManager';
import CreatePurchaseOrder from './pages/CreatePurchaseOrder';
import CustomerManager from './pages/CustomerManager';
import SalesOrderManager from './pages/SalesOrderManager';
import CreateSalesOrder from './pages/CreateSalesOrder';
import RoleManager from './pages/RoleManager';
import AuditLogManager from './pages/AuditLogManager';

// --- Import Layout and Helper Components ---
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout'; // <-- Import the new layout

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- Public Routes (No Layout) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* --- Protected User Route (No Admin Layout) --- */}
          <Route element={<ProtectedRoute roles={['user', 'admin']} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>

          {/* --- Protected Admin Routes (Wrapped in AdminLayout) --- */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<AdminLayout />}> {/* <-- Parent route for the layout */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/fields" element={<ProductFieldManager />} />
              <Route path="/admin/categories" element={<CategoryManager />} />
              <Route path="/admin/warehouses" element={<WarehouseManager />} />
              <Route path="/admin/products" element={<ProductManager />} />
              <Route path="/admin/suppliers" element={<SupplierManager />} />
              <Route path="/admin/pos" element={<PurchaseOrderManager />} />
              <Route path="/admin/pos/create" element={<CreatePurchaseOrder />} />
              <Route path="/admin/customers" element={<CustomerManager />} />
              <Route path="/admin/salesorders" element={<SalesOrderManager />} />
              <Route path="/admin/salesorders/create" element={<CreateSalesOrder />} />
              <Route path="/admin/roles" element={<RoleManager />} />
              <Route path="/admin/auditlogs" element={<AuditLogManager />} />
            </Route>
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
