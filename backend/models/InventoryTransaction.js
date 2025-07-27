// models/InventoryTransaction.js

const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
    // We will create the Product model later, but we can reference it now.
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['inbound', 'outbound', 'adjustment', 'transfer'], // Movement type
    },
    quantity: {
        type: Number,
        required: true,
        // Quantity can be positive (inbound) or negative (outbound)
    },
    reason: {
        type: String,
        trim: true,
    },
    // This could link to a sales order, purchase order, etc.
    relatedOrderId: {
        type: String,
        trim: true,
    },
    // The user who recorded this transaction
    transactionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The prompt asks for 'timestamp', which mongoose's 'timestamps: true' handles
    // by creating 'createdAt' and 'updatedAt'. 'createdAt' serves this purpose perfectly.
}, {
    timestamps: true,
});

const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema);

module.exports = InventoryTransaction;
