const express = require('express');
const router = express.Router();
const DashboardController = require('../controller/dashboardController');

router.get('/dashboard', DashboardController.getDashboardData);

module.exports = router;
