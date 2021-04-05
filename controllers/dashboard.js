const connection = require('../config/dbConnection');

module.exports.renderDashboard = async (req, res) => {
    const q = "SELECT priority, COUNT(*) AS count FROM tickets WHERE priority = 'High'; " +
        "SELECT priority, COUNT(*) AS count FROM tickets WHERE priority = 'Medium'; " +
        "SELECT priority, COUNT(*) AS count FROM tickets WHERE priority = 'Low'; " +
        "SELECT type, COUNT(*) AS count FROM tickets WHERE type = 'Bugs/Errors'; " +
        "SELECT type, COUNT(*) AS count FROM tickets WHERE type = 'Requests'; " +
        "SELECT type, COUNT(*) AS count FROM tickets WHERE type = 'Other'; " +
        "SELECT status, COUNT(*) AS count FROM tickets WHERE status = 'Open'; " +
        "SELECT status, COUNT(*) AS count FROM tickets WHERE status = 'In Progress'; " +
        "SELECT status, COUNT(*) AS count FROM tickets WHERE status = 'Closed'; " +
        "SELECT COUNT(*) AS count FROM projects; " +
        "SELECT COUNT(*) AS count FROM users WHERE role = 'None'; " +
        "SELECT COUNT(*) AS count FROM tickets WHERE assigned_dev = 'None'"
    connection.query(q, (err, results) => {
        if (err) throw err;
        const highPriority = results[0];
        const mediumPriority = results[1];
        const lowPriority = results[2];
        const bugsErrors = results[3];
        const requests = results[4];
        const other = results[5];
        const open = results[6];
        const inProgress = results[7];
        const closed = results[8];
        const projects = results[9];
        const noRole = results[10];
        const noAssignee = results[11];
        res.render('dashboard', { highPriority, mediumPriority, lowPriority, bugsErrors, requests, other, open, inProgress, closed, projects, noRole, noAssignee });
    })
};
