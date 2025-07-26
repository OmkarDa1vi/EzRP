// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A component to protect routes based on authentication status and user roles.
 * @param {object} props
 * @param {string[]} props.roles - An array of roles allowed to access the route.
 */
const ProtectedRoute = ({ roles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    // 1. Show a loading indicator while the auth state is being determined.
    // This prevents a flash of the login page before the user is authenticated.
    if (loading) {
        return <div>Loading...</div>;
    }

    // 2. If the user is not authenticated, redirect them to the sign-in page.
    // The 'replace' prop prevents the user from going back to the protected route.
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    // 3. If the route requires specific roles and the user's role is not included,
    // redirect them to an unauthorized page.
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 4. If the user is authenticated and has the correct role, render the child component.
    // <Outlet /> is a placeholder from react-router-dom for the nested route's component.
    return <Outlet />;
};

export default ProtectedRoute;
