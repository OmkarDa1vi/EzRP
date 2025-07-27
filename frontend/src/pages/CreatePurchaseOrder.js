// src/pages/CreatePurchaseOrder.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supplierService from '../services/supplierService';
import productService from '../services/productService';
import purchaseOrderService from '../services/purchaseOrderService';

const CreatePurchaseOrder = () => {
    const [step, setStep] = useState(1); // Step 1: Select Supplier, Step 2: Add Items
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [items, setItems] = useState([]);
    const [expectedDate, setExpectedDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { token } = useAuth();
    const navigate = useNavigate();

    // Fetch suppliers and products when the component loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppliersData, productsData] = await Promise.all([
                    supplierService.getAll(token),
                    productService.getAll(token)
                ]);
                setSuppliers(suppliersData);
                setProducts(productsData);
            } catch (err) {
                setError('Failed to load necessary data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleSelectSupplier = (supplierId) => {
        setSelectedSupplier(supplierId);
        setStep(2);
    };

    const handleAddItem = (product) => {
        // Check if item already exists
        const existingItem = items.find(i => i.productId === product._id);
        if (existingItem) {
            // Increase quantity if item exists
            setItems(items.map(i => i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            // Add new item
            setItems([...items, {
                productId: product._id,
                name: product.name,
                sku: product.sku,
                quantity: 1,
                cost: product.costPrice || 0,
            }]);
        }
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.cost), 0).toFixed(2);
    };

    const handleSubmitPO = async () => {
        if (items.length === 0) {
            setError('Please add at least one item to the purchase order.');
            return;
        }
        setError('');
        try {
            const poData = {
                supplierId: selectedSupplier,
                items: items.map(({ productId, quantity, cost }) => ({ productId, quantity, cost })),
                expectedDate: expectedDate || null,
                status: 'draft', // All new POs start as draft
            };
            await purchaseOrderService.create(poData, token);
            navigate('/admin/pos'); // Redirect to the PO list page on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create purchase order.');
        }
    };

    if (loading) return <div className="container"><p>Loading...</p></div>;
    if (error) return <div className="container"><p style={{color: 'red'}}>{error}</p></div>;

    return (
        <div className="container" style={{ maxWidth: '1200px' }}>
            <h2>Create New Purchase Order</h2>
            
            {step === 1 && (
                <div>
                    <h4>Step 1: Select a Supplier</h4>
                    <div className="form-group">
                        <label>Supplier</label>
                        <select className="form-control" onChange={(e) => handleSelectSupplier(e.target.value)} defaultValue="">
                            <option value="" disabled>-- Choose a supplier --</option>
                            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <button onClick={() => setStep(1)} className="btn" style={{backgroundColor: '#6c757d', marginBottom: '1rem'}}>Back to Supplier Select</button>
                    <h4>Step 2: Add Items to Order</h4>
                    <p><strong>Supplier:</strong> {suppliers.find(s => s._id === selectedSupplier)?.name}</p>
                    
                    {/* Add Item Section */}
                    <div className="form-group">
                        <label>Add Product</label>
                        <select className="form-control" onChange={(e) => handleAddItem(products.find(p => p._id === e.target.value))} defaultValue="">
                            <option value="" disabled>-- Select a product to add --</option>
                            {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
                        </select>
                    </div>

                    {/* Items Table */}
                    <table style={{width: '100%', marginTop: '2rem'}}>
                        <thead>
                            <tr><th>Product</th><th>Quantity</th><th>Unit Cost</th><th>Subtotal</th><th></th></tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td><input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} style={{width: '80px'}} /></td>
                                    <td><input type="number" value={item.cost} onChange={(e) => handleItemChange(index, 'cost', parseFloat(e.target.value))} style={{width: '100px'}} /></td>
                                    <td>₹{(item.quantity * item.cost).toFixed(2)}</td>
                                    <td><button onClick={() => handleRemoveItem(index)} style={{color: 'red'}}>Remove</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h4 style={{textAlign: 'right', marginTop: '1rem'}}>Total: ${calculateTotal()}</h4>

                    <div className="form-group">
                        <label>Expected Delivery Date (Optional)</label>
                        <input type="date" className="form-control" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
                    </div>

                    <button onClick={handleSubmitPO} className="btn" style={{marginTop: '2rem'}}>Create Purchase Order</button>
                </div>
            )}
        </div>
    );
};

export default CreatePurchaseOrder;
