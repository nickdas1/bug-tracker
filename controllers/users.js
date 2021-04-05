const connection = require('../config/dbConnection');
const bcrypt = require('bcryptjs');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    const { email, username, password, confirmPassword } = req.body;
    let salt = await bcrypt.genSaltSync(10);
    let newUser = {
        email: email,
        username: username,
        password: bcrypt.hashSync(password, salt)
    };
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match!');
        return res.redirect('/register');
    };
    connection.query("INSERT INTO users SET ? ", [newUser], (err, results) => {
        if (err) {
            if (err.errno === 1062) {
                req.flash('error', 'That username and/or email is already in use!');
                return res.redirect('/register');
            } else {
                throw err;
            }
        }
        req.flash('success', 'Successfully created an account!');
        res.redirect('/login');
    });
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully logged out!');
    res.redirect('/login');
};