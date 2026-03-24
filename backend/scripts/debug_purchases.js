require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const PurchaseOrder = require('../models/PurchaseOrder');
const SalesOrder = require('../models/SalesOrder');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const purchaseCount = await PurchaseOrder.countDocuments();
        console.log(`Total Purchase Orders: ${purchaseCount}`);

        const salesCount = await SalesOrder.countDocuments();
        console.log(`Total Sales Orders: ${salesCount}`);

        const purchases = await PurchaseOrder.find({});
        const purchaseSum = purchases.reduce((acc, p) => acc + (p.totalAmount || 0), 0);
        console.log(`Total Purchase Amount: ${purchaseSum}`);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
