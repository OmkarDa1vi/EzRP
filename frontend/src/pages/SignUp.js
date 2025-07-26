// src/pages/SignUp.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const SignUp = () => {
    // State to hold form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // Default role is 'user'
    });

    // State for handling messages and errors
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

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
        e.preventDefault(); // Prevent default form submission
        setMessage('');
        setError('');

        try {
            // Call the signup service
            const response = await authService.signup(formData);
            setMessage('Sign-up successful! You will be redirected to sign in.');
            
            // Redirect to sign-in page after a short delay
            setTimeout(() => {
                navigate('/signin');
            }, 2000);

        } catch (err) {
            // Handle errors from the backend
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            setError(errorMessage);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                
                {/* Display success or error messages */}
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
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
                        minLength="6"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="user"
                                checked={formData.role === 'user'}
                                onChange={handleChange}
                            /> User
                        </label>
                        <label style={{ marginLeft: '1rem' }}>
                            <input
                                type="radio"
                                name="role"
                                value="admin"
                                checked={formData.role === 'admin'}
                                onChange={handleChange}
                            /> Admin
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
