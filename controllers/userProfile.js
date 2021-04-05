const connection = require('../config/dbConnection');
const bcrypt = require('bcryptjs');

module.exports.renderProfile = async (req, res) => {
    const q = "SELECT * FROM users WHERE user_id = ?";
    connection.query(q, [req.user.user_id], (err, results) => {
        if (err) throw err;
        res.render('userProfile/show', { results });
    });
};

module.exports.renderChangePassword = async (req, res) => {
    res.render('userProfile/changePassword');
}

module.exports.changePassword = async (req, res) => {
    const { current, newPassword, confirmPassword } = req.body;
    const user = req.user;
    let salt = await bcrypt.genSaltSync(10);
    const newHash = await bcrypt.hashSync(newPassword, salt);
    if (user.username === 'Demo_Admin' || user.username === 'Demo_Developer' || user.username === 'Demo_Manager' || user.username === 'Demo_Submitter') {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/profile');
    }
    if (newPassword !== confirmPassword) {
        req.flash('error', 'New passwords do not match!');
        return res.redirect('/profile/changePassword');
    };
    bcrypt.compare(current, req.user.password, (err, isMatch) => { // needs to be run before connection.query
        if (err) throw err;
        if (isMatch) {
            const q = "UPDATE users SET password = ? WHERE user_id = ?";
            connection.query(q, [newHash, user.user_id], (err, results) => {
                if (err) throw err;
                req.flash('success', 'Password successfully changed!');
                return res.redirect('/dashboard');
            })
        } else {
            req.flash('error', 'Current password is incorrect!');
            return res.redirect('/profile/changePassword');
        }
    });
}