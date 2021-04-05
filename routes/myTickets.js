const express = require('express');
const router = express.Router();
const myTickets = require('../controllers/myTickets');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.get('/', isLoggedIn, catchAsync(myTickets.renderTickets));

module.exports = router;