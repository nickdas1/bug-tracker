const connection = require('../config/dbConnection');

module.exports.renderManageRoles = async (req, res) => {
    const perPage = 15;
    const pageQuery = parseInt(req.query.page);
    const pageNumber = pageQuery ? pageQuery : 1;
    const limit = (perPage * pageNumber) - perPage;
    const q = "SELECT * FROM users ORDER BY username LIMIT ?, 15; SELECT COUNT(*) AS count FROM users; SELECT COUNT(*) as numRows FROM (SELECT * FROM users LIMIT ?, 15) AS count; SELECT * FROM users;"
    connection.query(q, [limit, limit], (err, results) => {
        if (err) throw err;
        const users = results[0];
        const count = results[1][0].count;
        const numPages = Math.ceil(count / perPage);
        const numRows = results[2][0].numRows;
        const selection = results[3];
        res.render('manageRoles/show', { users, numPages, count, current: pageNumber, numRows, selection });
    });
};

module.exports.updateRoles = async (req, res) => {
    connection.query("UPDATE users SET role = ? WHERE username IN (?)", [req.body.role, req.body.users], (err, results) => {
        if (err) throw err;
        req.flash('success', 'Role(s) Successfully Updated!');
        res.redirect('/manageroles');
    });
};