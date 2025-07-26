// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode'; // We need to install this package

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // This effect runs once when the component mounts
    useEffect(() => {
        if (token) {
            try {
                // Decode the token to get user information and check expiration
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp > currentTime) {
                    // Token is valid
                    setUser({ id: decodedToken.id, role: decodedToken.role });
                } else {
                    // Token is expired
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Invalid token:", error);
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
        }
        setLoading(false); // Finished initial loading
    }, [token]);

    // Login function
    const login = async (credentials) => {
        const response = await authService.signin(credentials);
        const { token: responseToken } = response.data;
        
        localStorage.setItem('token', responseToken);
        setToken(responseToken);

        const decodedToken = jwtDecode(responseToken);
        setUser({ id: decodedToken.id, role: decodedToken.role });
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    // The value provided to consuming components
    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user, // A boolean to easily check if logged in
        loading, // To know when the initial auth check is complete
    };

    // Render children only when not loading
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook for easy consumption of the context
export const useAuth = () => {
    return useContext(AuthContext);
};
