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
import CategoryManager from './pages/CategoryManager'; // <-- Import the new page

// --- Import Helper Components ---
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* --- Protected User Route --- */}
          <Route element={<ProtectedRoute roles={['user', 'admin']} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>

          {/* --- Protected Admin Routes --- */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/fields" element={<ProductFieldManager />} />
            <Route path="/admin/categories" element={<CategoryManager />} /> {/* <-- Add the new route */}
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
