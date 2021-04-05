const express = require('express');
const router = express.Router();
const profile = require('../controllers/userProfile');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.get('/', isLoggedIn, catchAsync(profile.renderProfile));

router.route('/changePassword')
    .get(isLoggedIn, catchAsync(profile.renderChangePassword))
    .put(isLoggedIn, catchAsync(profile.changePassword));

module.exports = router;