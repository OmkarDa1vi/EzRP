    // src/pages/Home.js
    import React from 'react';
    import { Link } from 'react-router-dom';

    const Home = () => {
        return (
            <div className="container" style={{ textAlign: 'center' }}>
                <h2>Welcome to the Application</h2>
                <p>Please sign up or sign in to continue.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <Link to="/signup" className="btn" style={{ textDecoration: 'none' }}>Sign Up</Link>
                    <Link to="/signin" className="btn" style={{ textDecoration: 'none' }}>Sign In</Link>
                </div>
            </div>
        );
    };

    export default Home;
    