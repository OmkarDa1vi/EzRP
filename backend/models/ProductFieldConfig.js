// models/ProductFieldConfig.js

const mongoose = require('mongoose');

// This is the complete list of all possible fields.
const ALL_PRODUCT_FIELDS = [
    'id', 'sku', 'name', 'description', 'categoryId', 'productType', 'brand', 
    'supplierSku', 'unit', 'weight', 'dimensions', 'b2cPrice', 'b2bPrice', 
    'costPrice', 'purchaseTaxRate', 'salesTaxRate', 'taxCategory', 'expiryDate', 
    'manufactureDate', 'shelfLifeDays', 'storageConditions', 'lotNumber', 
    'serialNumbers', 'minOrderQty', 'maxOrderQty', 'reorderLevel', 'attributes', 
    'tags', 'images', 'videos', 'status', 'createdAt', 'updatedAt'
];

// We will set a few essential fields as the default selection.
const DEFAULT_FIELDS = [
    'sku', 'name', 'description', 'b2cPrice', 'status'
];

const productFieldConfigSchema = new mongoose.Schema({
    // A unique key to ensure we only ever have one configuration document.
    configKey: {
        type: String,
        default: 'main',
        unique: true
    },
    // An array that will store the names of the fields the admin has selected.
    activeFields: {
        type: [String],
        // Each string in the array must be one of the allowed field names.
        enum: ALL_PRODUCT_FIELDS,
        default: DEFAULT_FIELDS
    }
});

const ProductFieldConfig = mongoose.model('ProductFieldConfig', productFieldConfigSchema);

module.exports = ProductFieldConfig;
