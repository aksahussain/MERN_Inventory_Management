require('dotenv').config();
const mongoose = require('mongoose');
const PurchaseOrder = require('./models/PurchaseOrder');

const checkPurchases = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const orders = await PurchaseOrder.find({});
        console.log('--- Purchase Orders ---');
        orders.forEach(o => {
            console.log(`ID: ${o._id}, Status: ${o.status}, Total: ${o.totalAmount}`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkPurchases();
