const connection = require('../config/dbConnection');

module.exports.index = async (req, res) => {
    const perPage = 10;
    const pageQuery = parseInt(req.query.page);
    const pageNumber = pageQuery ? pageQuery : 1;
    const limit = (perPage * pageNumber) - perPage;
    connection.query("SELECT COUNT(*) AS count FROM projects; SELECT * FROM projects LIMIT ?, 10; SELECT COUNT(*) as numRows FROM (SELECT * FROM projects LIMIT ?, 10) AS count", [limit, limit], (err, results) => {
        if (err) throw err;
        const count = results[0][0].count;
        const numPages = Math.ceil(count / perPage);
        const projects = results[1];
        const numRows = results[2][0].numRows;
        res.render('projects/index', { projects, numPages, count, current: pageNumber, numRows });
    });
};

module.exports.renderNewForm = async (req, res) => {
    res.render('projects/new');
};

module.exports.createProject = async (req, res) => {
    connection.query("INSERT INTO projects SET ?, project_user_id = ?", [req.body, req.user.user_id], (err, results) => {
        if (err) throw err;
        req.flash('success', 'Successfully created a new project!');
        res.redirect(`/projects/${results.insertId}`);
    });
};

module.exports.showProject = async (req, res) => {
    const { id } = req.params;
    const perPage = 5;
    const pageQuery = parseInt(req.query.page);
    const userPageQuery = parseInt(req.query.userpage);
    const pageNumber = pageQuery ? pageQuery : 1;
    const userPageNum = userPageQuery ? userPageQuery : 1;
    const limit = (perPage * pageNumber) - perPage;
    const userLimit = (perPage * userPageNum) - perPage;
    const q = "SELECT * FROM projects WHERE projects.project_id = ?; " +
"SELECT COUNT(*) AS count FROM tickets WHERE tickets.ticket_project_id = ?; " +
"SELECT name, description, title, ticket_id, ticket_description, status, created_at, username FROM projects LEFT JOIN tickets ON tickets.ticket_project_id = projects.project_id LEFT JOIN users ON users.user_id = tickets.ticket_user_id WHERE projects.project_id = ? ORDER BY created_at DESC LIMIT ?, 5; " +
"SELECT user_id, username, email, role FROM project_users LEFT JOIN users ON project_users.assigneduser_id = users.user_id WHERE project_id = ? ORDER BY username LIMIT ?, 5; " +
"SELECT COUNT(*) AS count FROM project_users WHERE project_id = ?; " +
"SELECT COUNT(*) AS numRows FROM (SELECT * FROM projects LEFT JOIN tickets ON tickets.ticket_project_id = projects.project_id LEFT JOIN users ON users.user_id = tickets.ticket_user_id WHERE projects.project_id = ? ORDER BY created_at DESC LIMIT ?, 5) AS count; " +
"SELECT COUNT(*) AS numRows FROM (SELECT * FROM project_users LEFT JOIN users ON project_users.assigneduser_id = users.user_id WHERE project_id = ? LIMIT ?, 5) AS count"
    connection.query(q, [id, id, id, limit, id, userLimit, id, id, limit, id, userLimit], (err, results) => {
        if (err) throw err;
        if (!results[0].length) {
            req.flash('error', 'Project does not exist!');
            return res.redirect('/projects');
        }
        const project = results[0];
        const ticketCount = results[1][0].count
        const numTicketPages = Math.ceil(ticketCount / perPage);
        const tickets = results[2];
        const users = results[3];
        const userCount = results[4][0].count
        const numUserPages = Math.ceil(userCount / perPage);
        const numTicketRows = results[5][0].numRows;
        const numUserRows = results[6][0].numRows;
        res.render('projects/show', { project, tickets, users, id, pageQuery, userPageQuery, numTicketPages, numUserPages, current: pageNumber, userCurrent: userPageNum, numTicketRows, numUserRows });
    });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    connection.query("SELECT * FROM projects WHERE project_id = ?", [id], (err, results) => {
        if (err) throw err;
        if (!results.length) {
            req.flash('error', 'Project does not exist!');
            return res.redirect('/projects');
        }
        res.render('projects/edit', { results });
    });
};

module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    connection.query("UPDATE projects SET ? WHERE project_id = ?", [req.body, id], (err, results) => {
        if (err) throw err;
        req.flash('success', 'Project successfully updated!');
        res.redirect(`/projects/${id}`);
    });
};

module.exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    connection.query("DELETE FROM projects WHERE project_id = ?", [id], (err, results) => {
        if (err) throw err;
        req.flash('success', 'Project successfully deleted!');
        res.redirect('/projects/');
    });
};