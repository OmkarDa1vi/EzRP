// server.js

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import All Models
const Role = require('./models/Role');
const Permission = require('./models/Permission');

// Load environment variables from .env file
dotenv.config();

// --- IMPORT ALL ROUTE FILES ---
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const dataRoutes = require('./routes/dataRoutes');
const configRoutes = require('./routes/configRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const userRoutes = require('./routes/userRoutes');
const inventoryTransactionRoutes = require('./routes/inventoryTransactionRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const salesOrderRoutes = require('./routes/salesOrderRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');

// Initialize the Express app
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001;

if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
    process.exit(1);
}

// --- Advanced Seeder for Permissions and Roles ---
const seedDatabase = async () => {
    try {
        const allPermissions = [
            { module: 'products', action: 'manage', description: 'Full access to products' },
            { module: 'categories', action: 'manage', description: 'Full access to categories' },
            { module: 'warehouses', action: 'manage', description: 'Full access to warehouses' },
            { module: 'suppliers', action: 'manage', description: 'Full access to suppliers' },
            { module: 'customers', action: 'manage', description: 'Full access to customers' },
            { module: 'purchase_orders', action: 'manage', description: 'Full access to purchase orders' },
            { module: 'sales_orders', action: 'manage', description: 'Full access to sales orders' },
            { module: 'users', action: 'manage', description: 'Full access to users' },
            { module: 'roles', action: 'manage', description: 'Full access to roles and permissions' },
            { module: 'settings', action: 'manage', description: 'Full access to application settings' },
            { module: 'dashboard', action: 'view', description: 'Can view the main dashboard' },
            { module: 'data', action: 'submit', description: 'Can submit data' },
            { module: 'audit_logs', action: 'read', description: 'Can view audit logs' },
        ];

        const permissionPromises = allPermissions.map(p =>
            Permission.findOneAndUpdate({ module: p.module, action: p.action }, { $setOnInsert: p }, { upsert: true, new: true })
        );
        const createdPermissions = await Promise.all(permissionPromises);
        console.log('Permissions seeded successfully.');

        const adminPermissionIds = createdPermissions.map(p => p._id);
        await Role.findOneAndUpdate(
            { name: 'admin' },
            { name: 'admin', description: 'Has all permissions', isDefault: true, permissions: adminPermissionIds },
            { upsert: true }
        );
        console.log('Admin role seeded/updated successfully.');

        const userPermissionNames = ['dashboard-view', 'data-submit'];
        const userPermissions = createdPermissions.filter(p => userPermissionNames.includes(`${p.module}-${p.action}`));
        const userPermissionIds = userPermissions.map(p => p._id);
        await Role.findOneAndUpdate(
            { name: 'user' },
            { name: 'user', description: 'Can view dashboard and submit data', isDefault: true, permissions: userPermissionIds },
            { upsert: true }
        );
        console.log('User role seeded successfully.');

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB.');
        seedDatabase();
        app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1);
    });

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/config', configRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryTransactionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/pos', purchaseOrderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/salesorders', salesOrderRoutes);
app.use('/api/auditlogs', auditLogRoutes);

app.get('/', (req, res) => res.json({ message: 'Welcome to the MERN Auth API!' }));
