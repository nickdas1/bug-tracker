const connection = require('../config/dbConnection');

module.exports.renderDashboard = async (req, res) => {
    const q = "SELECT priority, COUNT(*) AS count FROM TICKETS GROUP BY priority; " +
        "SELECT type, COUNT(*) AS count FROM TICKETS GROUP BY type; " +
        "SELECT status, COUNT(*) AS count FROM TICKETS GROUP BY status; " + 
        "SELECT COUNT(*) AS count FROM projects; " +
        "SELECT COUNT(*) AS count FROM tickets WHERE priority = 'High'; " +
        "SELECT COUNT(*) AS count FROM users WHERE role = 'None'; " + 
        "SELECT COUNT(*) AS count FROM tickets WHERE assigned_dev = 'None'"  
        connection.query(q, (err, results) => {
        if (err) throw err;
        const priority = results[0];
        const type = results[1];
        const status = results[2];
        const projects = results[3];
        const highPriority = results[4];
        const noRole = results[5];
        const noAssignee = results[6];
        res.render('dashboard', { priority, type, status, projects, highPriority, noRole, noAssignee });
    })
};
