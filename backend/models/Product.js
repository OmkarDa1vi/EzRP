// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // --- Core Identification ---
    sku: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    
    // --- Classification ---
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    productType: { 
        type: String, 
        enum: ['standard', 'bundle', 'service', 'subscription'],
        default: 'standard'
    },
    brand: { type: String, trim: true },
    supplierSku: { type: String, trim: true },

    // --- Physical Attributes ---
    unit: { type: String, default: 'pcs' }, // e.g., pcs, kg, meter
    weight: { type: Number },
    dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
    },

    // --- Pricing ---
    b2cPrice: { type: Number, required: true, default: 0 }, // Retail price
    b2bPrice: { type: Number }, // Wholesale price
    costPrice: { type: Number }, // Internal cost

    // --- Taxation ---
    purchaseTaxRate: { type: Number, default: 0 },
    salesTaxRate: { type: Number, default: 0 },
    taxCategory: { type: String },

    // --- Lifecycle & Traceability ---
    expiryDate: { type: Date },
    manufactureDate: { type: Date },
    shelfLifeDays: { type: Number },
    storageConditions: { type: String },
    lotNumber: { type: String },
    serialNumbers: { type: [String], default: [] },

    // --- Order & Stock Control ---
    minOrderQty: { type: Number, default: 1 },
    maxOrderQty: { type: Number },
    reorderLevel: { type: Number },

    // --- Rich Content & Metadata ---
    attributes: [{
        key: { type: String },
        value: { type: String },
    }],
    tags: { type: [String], default: [] },
    images: { type: [String], default: [] }, // Array of image URLs
    videos: { type: [String], default: [] }, // Array of video URLs
    
    // --- Status ---
    status: {
        type: String,
        enum: ['active', 'inactive', 'discontinued'],
        default: 'active',
    },
}, {
    // The 'id' field is virtual and created by default.
    // 'createdAt' and 'updatedAt' are handled by timestamps.
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
