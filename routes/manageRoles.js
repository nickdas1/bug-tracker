const express = require('express');
const router = express.Router();
const manageRoles = require('../controllers/manageRoles');
const { isLoggedIn, isAdmin } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(isLoggedIn, catchAsync(manageRoles.renderManageRoles))
    .post(isLoggedIn, isAdmin, catchAsync(manageRoles.updateRoles));

module.exports = router;