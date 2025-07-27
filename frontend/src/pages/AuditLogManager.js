// src/pages/AuditLogManager.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import auditLogService from '../services/auditLogService';

const AuditLogManager = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);

    const { token } = useAuth();

    // Function to fetch logs for a specific page
    const fetchLogs = async (page) => {
        try {
            setLoading(true);
            const data = await auditLogService.getAll(token, page);
            setLogs(data.logs);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
            setTotalLogs(data.totalLogs);
        } catch (err) {
            setError('Failed to fetch audit logs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch initial data when the component mounts
    useEffect(() => {
        fetchLogs(1);
    }, [token]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchLogs(newPage);
        }
    };

    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
    const thStyle = { border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' };
    const tdStyle = { border: '1px solid #ddd', padding: '8px' };

    return (
        <div className="container" style={{maxWidth: '1200px'}}>
            <h2>Audit Log</h2>
            <p>Here you can view a history of all significant actions performed in the system.</p>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? <p>Loading logs...</p> : (
                <>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Timestamp</th>
                                    <th style={thStyle}>User</th>
                                    <th style={thStyle}>Action Type</th>
                                    <th style={thStyle}>Module</th>
                                    <th style={thStyle}>Action Description</th>
                                    <th style={thStyle}>IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log._id}>
                                        <td style={tdStyle}>{new Date(log.createdAt).toLocaleString()}</td>
                                        <td style={tdStyle}>{log.userId?.name || 'N/A'}</td>
                                        <td style={tdStyle}>{log.actionType}</td>
                                        <td style={tdStyle}>{log.module}</td>
                                        <td style={tdStyle}>{log.action}</td>
                                        <td style={tdStyle}>{log.ipAddress}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Controls */}
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Page {currentPage} of {totalPages} ({totalLogs} total logs)</span>
                        <div>
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="btn" style={{marginRight: '10px'}}>
                                Previous
                            </button>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="btn">
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AuditLogManager;
