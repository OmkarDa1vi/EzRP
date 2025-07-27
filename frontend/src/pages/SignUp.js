// src/pages/SignUp.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // This will be 'user' or 'admin'
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            // Prepare the data to be sent to the backend, ensuring the role is sent as 'roleName'
            const signupData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                roleName: formData.role, // The backend expects 'roleName'
            };
            await authService.signup(signupData);
            setMessage('Sign-up successful! Redirecting to sign in...');
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            setError(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Your Account</h2>
                <p>Get started with a new account today.</p>

                <form onSubmit={handleSubmit}>
                    {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}
                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>
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
                            onChange={handleChange} // <-- THIS LINE WAS MISSING
                            minLength="6"
                            required
                            placeholder="Minimum 6 characters"
                        />
                    </div>
                    
                    {/* --- Admin/User Role Selection --- */}
                    <div className="form-group">
                        <label>Role</label>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '0.5rem' }}>
                            <label style={{ fontWeight: 'normal', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={formData.role === 'user'}
                                    onChange={handleChange}
                                    style={{ width: 'auto', marginRight: '0.5rem' }}
                                />
                                User
                            </label>
                            <label style={{ fontWeight: 'normal', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={formData.role === 'admin'}
                                    onChange={handleChange}
                                    style={{ width: 'auto', marginRight: '0.5rem' }}
                                />
                                Admin
                            </label>
                        </div>
                    </div>
                    {/* --- End Role Selection --- */}

                    <button type="submit" className="btn">Create Account</button>
                </form>

                <div className="auth-link">
                    <span>Already have an account? </span>
                    <Link to="/signin">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
