// models/SalesOrder.js

const mongoose = require('mongoose');

// Define the schema for individual line items within a sales order.
const soItemSchema = new mongoose.Schema({
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
    // The price per unit at the time of sale.
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative.'],
    }
}, { _id: false });


// Define the main schema for the Sales Order.
const salesOrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    salesPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        required: true,
        enum: ['draft', 'paid', 'cancelled', 'returned'],
        default: 'draft',
    },
    shipmentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending',
    },
    items: [soItemSchema],
    subtotal: { type: Number, required: true },
    discounts: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String },
    shippingAddress: { type: String, trim: true },
    notes: { type: String, trim: true },
    invoiced: { type: Boolean, default: false },
    invoiceId: { type: String, trim: true },
}, {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
});

const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);

module.exports = SalesOrder;
