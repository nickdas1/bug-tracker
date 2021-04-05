const express = require('express');
const router = express.Router({ mergeParams: true });
const users = require('../controllers/users');
const passport = require('passport');
const passportConfig = require('../controllers/passportConfig');
const catchAsync = require('../utils/catchAsync');

passportConfig(passport);

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.route('/login/demo')
    .post(passport.authenticate('demo',  { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;