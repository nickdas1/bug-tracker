const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboard');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.get('/', isLoggedIn, catchAsync(dashboard.renderDashboard));

module.exports = router;
