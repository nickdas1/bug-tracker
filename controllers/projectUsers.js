const connection = require('../config/dbConnection');

module.exports.renderAddUsers = async (req, res) => {
    const perPage = 15;
    const pageQuery = parseInt(req.query.page);
    const pageNumber = pageQuery ? pageQuery : 1;
    const limit = (perPage * pageNumber) - perPage;
    const { id } = req.params;
    const q = "SELECT user_id, username, email, role FROM users ORDER BY username LIMIT ?, 15; SELECT COUNT(*) AS count FROM users; SELECT COUNT(*) as numRows FROM (SELECT * FROM users LIMIT ?, 15) AS count"
    connection.query(q, [limit, limit], (err, results) => {
        if (err) throw err;
        const users = results[0];
        const count = results[1][0].count;
        const numPages = Math.ceil(count / perPage);
        const numRows = results[2][0].numRows;
        res.render('projectUsers/addUsers', { users, id, numPages, count, current: pageNumber, numRows });
    });
};

module.exports.addUsers = async (req, res) => {
    const { id } = req.params;
    connection.query("INSERT INTO project_users SET assigneduser_id = ?, project_id = ?", [req.body.user_id, id], (err, results) => {
        if (err) {
            if (err.errno === 1062) {
                req.flash('error', 'That user is already added to the project!');
                return res.redirect(`/projects/${id}/users/addusers`);
            } else {
                throw err;
            }
        }
        req.flash('success', 'User successfully added!');
        res.redirect(`/projects/${id}`);
    });
};

module.exports.deleteUsers = async (req, res) => {
    const { id } = req.params;
    connection.query("DELETE FROM project_users WHERE assigneduser_id = ? AND project_id = ?", [req.body.user_id, id], (err, results) => {
        if (err) throw err;
        req.flash('success', 'User successfully removed!');
        res.redirect(`/projects/${id}`);
    });
};