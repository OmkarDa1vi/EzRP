// src/pages/SignIn.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            // Redirect based on user role after successful login
            // Assuming 'admin' role has a specific permission like 'MANAGE_SETTINGS'
            // A more robust check would be to decode the token and check permissions
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData);
            // The useEffect above will handle the redirection.
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back!</h2>
                <p>Sign in to continue to your dashboard.</p>
                
                <form onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
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
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn">Sign In</button>
                </form>
                
                <div className="auth-link">
                    <span>Don't have an account? </span>
                    <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
