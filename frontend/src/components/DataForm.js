// src/components/DataForm.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import dataService from '../services/dataService';

const DataForm = ({ onNewData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const newData = { title, description };
            const createdItem = await dataService.createData(newData, token);
            
            setMessage('Data submitted successfully!');
            setTitle('');
            setDescription('');

            // Notify the parent component that new data has been added
            if (onNewData) {
                onNewData(createdItem);
            }

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to submit data.';
            setError(errorMessage);
        } finally {
            setLoading(false);
            // Clear success message after a few seconds
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h4>Submit New Data</h4>
            <form onSubmit={handleSubmit}>
                 {/* Display success or error messages */}
                 {message && <p style={{ color: 'green' }}>{message}</p>}
                 {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px', fontFamily: 'inherit' }}
                    />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Data'}
                </button>
            </form>
        </div>
    );
};

export default DataForm;
