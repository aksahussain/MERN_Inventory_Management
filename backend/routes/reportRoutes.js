const express = require('express');
const router = express.Router();
const { getDashboardStats, getChartData, getEcoStats } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/chart', protect, getChartData);
router.get('/eco', protect, getEcoStats);

module.exports = router;
