const SalesOrder = require('../models/SalesOrder');
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const StockLog = require('../models/StockLog');
const { calculateEcoImpact } = require('../utils/ecoAnalytics');

const getDashboardStats = async (req, res) => {
    try {
        const salesStats = await SalesOrder.aggregate([
            { $group: { _id: "$status", total: { $sum: "$totalAmount" } } }
        ]);
        const purchaseStats = await PurchaseOrder.aggregate([
            { $group: { _id: "$status", total: { $sum: "$totalAmount" } } }
        ]);
        const productCount = await Product.countDocuments();
        const lowStockCount = await Product.countDocuments({
            $expr: { $lte: ['$quantity', '$minStockLevel'] }
        });

        const getVal = (arr, status) => arr.find(s => s._id === status)?.total || 0;

        res.json({
            sales: getVal(salesStats, 'completed'),
            pendingSales: getVal(salesStats, 'pending'),
            purchases: getVal(purchaseStats, 'completed'),
            pendingPurchases: getVal(purchaseStats, 'pending'),
            products: productCount,
            lowStock: lowStockCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getChartData = async (req, res) => {
    try {
        // Last 7 days sales (grouped by status)
        const rawSales = await SalesOrder.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        status: "$status"
                    },
                    amount: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);

        // Transform data into { _id: "date", completed: X, pending: Y }
        const formattedData = rawSales.reduce((acc, curr) => {
            const date = curr._id.date;
            const status = curr._id.status;
            let existing = acc.find(item => item._id === date);
            if (!existing) {
                existing = { _id: date, amount: 0, pendingAmount: 0 };
                acc.push(existing);
            }
            if (status === 'completed') {
                existing.amount = curr.amount;
            } else if (status === 'pending') {
                existing.pendingAmount = curr.amount;
            }
            return acc;
        }, []);

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEcoStats = async (req, res) => {
    try {
        const products = await Product.find({});
        let totalCarbonFootprint = 0;

        products.forEach(p => {
            totalCarbonFootprint += calculateEcoImpact(p, p.quantity);
        });

        res.json({
            totalCarbonFootprint: totalCarbonFootprint.toFixed(2),
            sustainabilityScore: Math.max(0, 100 - (totalCarbonFootprint / 100)) // Mock formula
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getDashboardStats, getChartData, getEcoStats };
