// models/PurchaseOrder.js

const mongoose = require('mongoose');

// First, we define a schema for the individual items within a purchase order.
// This will be a sub-document array in the main PO schema.
const poItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1.'],
    },
    // The cost per unit at the time the PO was created.
    // This is important because product costs can change over time.
    cost: {
        type: Number,
        required: true,
        min: [0, 'Cost cannot be negative.'],
    }
}, { 
    // We set _id to false because these are sub-documents
    // and don't need their own top-level ID.
    _id: false 
});


// Now, we define the main schema for the Purchase Order.
const purchaseOrderSchema = new mongoose.Schema({
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        required: true,
        enum: ['draft', 'pending', 'received', 'cancelled'],
        default: 'draft',
    },
    // Here we embed the array of poItemSchema sub-documents.
    items: [poItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    expectedDate: {
        type: Date,
    },
    receivedDate: {
        type: Date,
    },
}, {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

module.exports = PurchaseOrder;
