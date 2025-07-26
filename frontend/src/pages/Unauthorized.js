// src/pages/Unauthorized.js

import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <h2>Access Denied</h2>
            <p>You do not have permission to view this page.</p>
            <Link to="/">Go to Homepage</Link>
        </div>
    );
};

export default Unauthorized;
