// services/auditLogService.js

const AuditLog = require('../models/AuditLog');

/**
 * A centralized function to create an audit log entry.
 * This should be called from controllers after a significant action is performed.
 *
 * @param {object} options - The details of the log entry.
 * @param {string} options.userId - The ID of the user who performed the action.
 * @param {string} options.action - A human-readable description of the action (e.g., "User created new product 'Laptop'").
 * @param {string} options.actionType - The category of the action (e.g., 'CREATE', 'UPDATE').
 * @param {string} options.module - The part of the system affected (e.g., 'products').
 * @param {string} [options.recordId] - The ID of the document that was affected.
 * @param {object} [options.previousValues] - A snapshot of the document before the change.
 * @param {object} [options.newValues] - A snapshot of the document after the change.
 * @param {string} [options.ipAddress] - The IP address of the user.
 * @param {object} [options.metadata] - Any other useful information (e.g., user-agent).
 */
const logAction = async (options) => {
    try {
        // Create a new log entry using the provided options
        const auditEntry = new AuditLog({
            userId: options.userId,
            action: options.action,
            actionType: options.actionType,
            module: options.module,
            recordId: options.recordId,
            previousValues: options.previousValues,
            newValues: options.newValues,
            ipAddress: options.ipAddress,
            metadata: options.metadata,
        });

        // Save the log entry to the database.
        // We don't wait for this to complete ('no-await') because logging should not
        // block or slow down the main application response to the user.
        // It's a background "fire-and-forget" task.
        auditEntry.save();

    } catch (error) {
        // If logging fails, we just log the error to the console.
        // We should never let a logging failure crash the main application logic.
        console.error('Failed to create audit log:', error);
    }
};

module.exports = {
    logAction,
};
