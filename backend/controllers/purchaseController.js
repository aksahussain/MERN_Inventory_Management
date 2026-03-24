const PurchaseOrder = require('../models/PurchaseOrder');
const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');
const StockLog = require('../models/StockLog');
const { generateInvoicePDF } = require('../utils/generatePDF');

// Purchase Order (Stock IN)
const createPurchaseOrder = async (req, res) => {
    const { supplier, products, totalAmount } = req.body;

    try {
        const order = await PurchaseOrder.create({
            supplier,
            products,
            totalAmount,
            createdBy: req.user._id,
            status: 'pending' // Explictly set to pending
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPurchaseOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrder.find({})
            .populate('supplier', 'name')
            .populate('products.product', 'name')
            .populate('createdBy', 'name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Sales Order (Stock OUT)
const createSalesOrder = async (req, res) => {
    const { customerName, products, totalAmount } = req.body;

    try {
        // NOTE: Stock check is now primarily handled in updateSalesStatus (completion).
        // This allows creating pending orders for items out of stock, which can be fulfilled later.
        /*
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product || product.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${product ? product.name : item.product}` });
            }
        }
        */

        const order = await SalesOrder.create({
            customerName,
            products,
            totalAmount,
            createdBy: req.user._id,
            status: 'pending' // Explicitly set to pending
        });

        // NOTE: Stock reduction and logs are now handled in updateSalesStatus
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSalesOrders = async (req, res) => {
    try {
        const orders = await SalesOrder.find({})
            .populate('products.product', 'name')
            .populate('createdBy', 'name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Purchase Order Status (Activation)
const updatePurchaseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await PurchaseOrder.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.status !== 'pending') {
            return res.status(400).json({ message: `Order is already ${order.status}` });
        }

        if (status === 'completed') {
            // Update Stock & Create Logs
            for (const item of order.products) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.quantity += item.quantity;
                    await product.save();

                    await StockLog.create({
                        product: item.product,
                        type: 'IN',
                        quantity: item.quantity,
                        reason: `Purchase Order Activation #${order._id}`,
                        performedBy: req.user._id
                    });
                }
            }
        }

        order.status = status;
        await order.save();
        res.json({ message: `Order marked as ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Sales Order Status (Verification)
const updateSalesStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await SalesOrder.findById(id);
        if (!order) return res.status(404).json({ message: 'Sales order not found' });

        if (order.status !== 'pending') {
            return res.status(400).json({ message: `Order is already ${order.status}` });
        }

        if (status === 'completed') {
            // Update Stock & Create Logs
            for (const item of order.products) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.quantity -= item.quantity;
                    await product.save();

                    await StockLog.create({
                        product: item.product,
                        type: 'OUT',
                        quantity: item.quantity,
                        reason: `Sales Order Completion #${order._id}`,
                        performedBy: req.user._id
                    });
                }
            }
        }

        order.status = status;
        await order.save();
        res.json({ message: `Sale marked as ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate Invoice PDF
const getInvoice = async (req, res) => {
    try {
        const { type, id } = req.params; // type: 'sales' or 'purchase'
        let order;

        if (type === 'sales') {
            order = await SalesOrder.findById(id).populate('products.product', 'name price');
        } else {
            order = await PurchaseOrder.findById(id).populate('products.product', 'name price');
        }

        if (!order) return res.status(404).json({ message: 'Order not found' });

        const pdfBuffer = generateInvoicePDF(order, type === 'sales' ? 'Sales' : 'Purchase');

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.byteLength,
        });
        res.send(Buffer.from(pdfBuffer));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Purchase Order
const deletePurchaseOrder = async (req, res) => {
    try {
        const order = await PurchaseOrder.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Purchase order not found' });
        res.json({ message: 'Purchase order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Sales Order
const deleteSalesOrder = async (req, res) => {
    try {
        const order = await SalesOrder.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Sales order not found' });
        res.json({ message: 'Sales order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPurchaseOrder,
    getPurchaseOrders,
    updatePurchaseStatus,
    updateSalesStatus,
    createSalesOrder,
    getSalesOrders,
    getInvoice,
    deletePurchaseOrder,
    deleteSalesOrder
};

