// src/components/DataTable.js

import React from 'react';

// A simple styling object for the table
const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
};

const thStyles = {
    backgroundColor: '#f2f2f2',
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
};

const tdStyles = {
    border: '1px solid #ddd',
    padding: '12px',
};

const trEvenStyles = {
    backgroundColor: '#f9f9f9',
};

const DataTable = ({ dataItems }) => {
    // If there are no items or the array is empty, show a message.
    if (!dataItems || dataItems.length === 0) {
        return <p>No data has been submitted yet.</p>;
    }

    return (
        <div>
            <h4>Submitted Data</h4>
            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th style={thStyles}>Title</th>
                        <th style={thStyles}>Description</th>
                        <th style={thStyles}>Submitted On</th>
                    </tr>
                </thead>
                <tbody>
                    {dataItems.map((item, index) => (
                        <tr key={item._id} style={index % 2 === 0 ? {} : trEvenStyles}>
                            <td style={tdStyles}>{item.title}</td>
                            <td style={tdStyles}>{item.description}</td>
                            <td style={tdStyles}>{new Date(item.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
