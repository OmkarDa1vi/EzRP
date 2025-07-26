// src/pages/SignIn.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import our custom hook

const SignIn = () => {
    // State for form fields
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // State for errors
    const [error, setError] = useState('');
    
    // Get the login function and user state from our AuthContext
    const { login, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // This effect will run when the component mounts or when the user state changes.
    // It handles redirecting the user after a successful login.
    useEffect(() => {
        if (isAuthenticated && user) {
            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);


    // Handles changes in form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Call the login function from the context
            await login(formData);
            // The useEffect above will now handle the redirection.

        } catch (err) {
            // Handle errors from the backend or login process
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h2>Sign In</h2>

                {/* Display error messages */}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn">Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;
