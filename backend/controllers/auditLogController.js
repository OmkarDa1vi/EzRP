// controllers/auditLogController.js

const AuditLog = require('../models/AuditLog');

/**
 * @desc    Get all audit log entries, with pagination
 * @route   GET /api/auditlogs
 * @access  Private (Requires 'VIEW_AUDIT_LOGS' permission)
 */
exports.getAllLogs = async (req, res) => {
    try {
        // Basic pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const skip = (page - 1) * limit;

        const logs = await AuditLog.find({})
            .sort({ createdAt: -1 }) // Show the most recent logs first
            .populate('userId', 'name email') // Get the name and email of the user
            .skip(skip)
            .limit(limit);

        const totalLogs = await AuditLog.countDocuments();

        res.status(200).json({
            logs,
            currentPage: page,
            totalPages: Math.ceil(totalLogs / limit),
            totalLogs,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching audit logs.', error: error.message });
    }
};
