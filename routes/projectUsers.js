const express = require('express');
const router = express.Router({ mergeParams: true });
const projectUsers = require('../controllers/projectUsers');
const { isLoggedIn, canAssign } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.route('/addusers')
    .get(isLoggedIn, canAssign, catchAsync(projectUsers.renderAddUsers))
    .post(isLoggedIn, canAssign, catchAsync(projectUsers.addUsers))
    .delete(isLoggedIn, canAssign, catchAsync(projectUsers.deleteUsers));

module.exports = router;


