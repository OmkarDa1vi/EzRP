// src/pages/CreateSalesOrder.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import customerService from '../services/customerService';
import productService from '../services/productService';
import salesOrderService from '../services/salesOrderService';

const CreateSalesOrder = () => {
    const [step, setStep] = useState(1); // Step 1: Select Customer, Step 2: Add Items
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [items, setItems] = useState([]);
    const [orderData, setOrderData] = useState({
        discounts: 0,
        taxAmount: 0,
        paymentMethod: 'card',
        shippingAddress: '',
        notes: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { token } = useAuth();
    const navigate = useNavigate();

    // Fetch customers and products when the component loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customersData, productsData] = await Promise.all([
                    customerService.getAll(token),
                    productService.getAll(token)
                ]);
                setCustomers(customersData);
                setProducts(productsData);
            } catch (err) {
                setError('Failed to load necessary data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleSelectCustomer = (customerId) => {
        setSelectedCustomer(customerId);
        const customer = customers.find(c => c._id === customerId);
        if (customer) {
            setOrderData(prev => ({ ...prev, shippingAddress: customer.address || '' }));
        }
        setStep(2);
    };

    const handleAddItem = (product) => {
        const existingItem = items.find(i => i.productId === product._id);
        if (existingItem) {
            setItems(items.map(i => i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setItems([...items, {
                productId: product._id,
                name: product.name,
                sku: product.sku,
                quantity: 1,
                price: product.b2cPrice || 0, // Use retail price as default
            }]);
        }
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };
    
    const handleOrderDataChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({ ...prev, [name]: value }));
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateSubtotal = () => items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    const handleSubmitSO = async () => {
        if (items.length === 0) {
            setError('Please add at least one item to the sales order.');
            return;
        }
        setError('');
        try {
            const finalData = {
                ...orderData,
                customerId: selectedCustomer,
                items: items.map(({ productId, quantity, price }) => ({ productId, quantity, price })),
                status: 'draft',
                shipmentStatus: 'pending',
            };
            await salesOrderService.create(finalData, token);
            navigate('/admin/salesorders');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create sales order.');
        }
    };

    if (loading) return <div className="container"><p>Loading...</p></div>;
    if (error) return <div className="container"><p style={{color: 'red'}}>{error}</p></div>;

    return (
        <div className="container" style={{ maxWidth: '1200px' }}>
            <h2>Create New Sales Order</h2>
            
            {step === 1 && (
                <div>
                    <h4>Step 1: Select a Customer</h4>
                    <div className="form-group">
                        <label>Customer</label>
                        <select className="form-control" onChange={(e) => handleSelectCustomer(e.target.value)} defaultValue="">
                            <option value="" disabled>-- Choose a customer --</option>
                            {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <button onClick={() => setStep(1)} className="btn" style={{backgroundColor: '#6c757d', marginBottom: '1rem'}}>Back to Customer Select</button>
                    <h4>Step 2: Build the Order</h4>
                    <p><strong>Customer:</strong> {customers.find(c => c._id === selectedCustomer)?.name}</p>
                    
                    <div className="form-group">
                        <label>Add Product to Order</label>
                        <select className="form-control" onChange={(e) => handleAddItem(products.find(p => p._id === e.target.value))} defaultValue="">
                            <option value="" disabled>-- Select a product --</option>
                            {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
                        </select>
                    </div>

                    <table style={{width: '100%', marginTop: '2rem'}}>
                        <thead><tr><th>Product</th><th>Quantity</th><th>Unit Price</th><th>Subtotal</th><th></th></tr></thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td><input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} style={{width: '80px'}} /></td>
                                    <td><input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))} style={{width: '100px'}} /></td>
                                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                                    <td><button onClick={() => handleRemoveItem(index)} style={{color: 'red'}}>Remove</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{width: '300px', marginLeft: 'auto', marginTop: '1rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}><p>Subtotal:</p><p>${calculateSubtotal().toFixed(2)}</p></div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><label>Discounts:</label><input type="number" name="discounts" value={orderData.discounts} onChange={handleOrderDataChange} style={{width: '100px'}} /></div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><label>Tax:</label><input type="number" name="taxAmount" value={orderData.taxAmount} onChange={handleOrderDataChange} style={{width: '100px'}} /></div>
                        <hr/>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}><h4>Total:</h4><h4>${(calculateSubtotal() - orderData.discounts + parseFloat(orderData.taxAmount || 0)).toFixed(2)}</h4></div>
                    </div>

                    <div className="form-group"><label>Shipping Address</label><textarea name="shippingAddress" className="form-control" value={orderData.shippingAddress} onChange={handleOrderDataChange} /></div>
                    <div className="form-group"><label>Notes</label><textarea name="notes" className="form-control" value={orderData.notes} onChange={handleOrderDataChange} /></div>

                    <button onClick={handleSubmitSO} className="btn" style={{marginTop: '2rem'}}>Create Sales Order</button>
                </div>
            )}
        </div>
    );
};

export default CreateSalesOrder;
