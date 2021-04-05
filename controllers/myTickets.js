const connection = require('../config/dbConnection');

module.exports.renderTickets = async (req, res) => {
    const userId = req.user.user_id;
    const perPage = 10;
    const pageQuery = parseInt(req.query.page);
    const pageNumber = pageQuery ? pageQuery : 1;
    const limit = (perPage * pageNumber) - perPage;
    const q = "SELECT * FROM tickets LEFT JOIN projects ON tickets.ticket_project_id = projects.project_id ORDER BY created_at DESC LIMIT ?, 10; " +
    "SELECT COUNT(*) AS count FROM tickets; " +
    "SELECT COUNT(*) as numRows FROM (SELECT * FROM tickets LIMIT ?, 10) AS count";
    connection.query(q, [limit, limit], (err, results) => {
        if (err) throw err;
        const tickets = results[0];
        const count = results[1][0].count;
        const numPages = Math.ceil(count / perPage);
        const numRows = results[2][0].numRows;
        res.render('tickets/myTickets', { tickets, numPages, count, current: pageNumber, numRows });
    });
};