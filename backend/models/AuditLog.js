// models/AuditLog.js

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
    },
    actionType: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN_SUCCESS', 'LOGIN_FAIL', 'PASSWORD_RESET', 'PERMISSION_CHANGE'],
    },
    module: {
        type: String,
        required: true,
        trim: true,
    },
    recordId: {
        type: String, // Storing as a string is flexible for different collection IDs
        trim: true,
    },
    previousValues: {
        type: mongoose.Schema.Types.Mixed, // Allows storing any object structure
    },
    newValues: {
        type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
        type: String,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed, // For extra context like user-agent, etc.
    },
}, {
    // The 'timestamp' field is automatically handled by 'createdAt'
    timestamps: { createdAt: true, updatedAt: false }, // We only care about when it was created
    // Capped collection is efficient for logs, automatically removing old entries
    // capped: { size: 1024 * 1024 * 50, max: 50000 } // 50MB or 50,000 documents
});

// Indexing for faster queries
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ module: 1, actionType: 1 });
auditLogSchema.index({ createdAt: -1 });


const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
