const connection = require('../config/dbConnection');

module.exports.renderNewForm = async (req, res) => {
    const { id } = req.params;
    connection.query("SELECT * FROM users, projects WHERE project_id = ?", [id], (err, results) => {
        if (err) throw err;
        res.render('tickets/newTicket', { results });
    });
};

module.exports.createTicket = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, type, assignee } = req.body
    connection.query("INSERT INTO tickets SET title = ?, ticket_description = ?, status = ?, priority = ?, type = ?, ticket_project_id = ?, ticket_user_id = ?, assigned_dev = ?",
        [title, description, status, priority, type, id, req.user.user_id, assignee],
        (err, results) => {
            if (err) throw err;
            req.flash('success', 'Successfully created a new ticket!');
            res.redirect(`/projects/${id}`);
        });
};

module.exports.showTicket = async (req, res) => {
    const { id, ticketId } = req.params;
    const perPage = 5;
    const pageQuery = parseInt(req.query.page);
    const historyPageQuery = parseInt(req.query.historypage);
    const pageNumber = pageQuery ? pageQuery : 1;
    const historyPageNum = historyPageQuery ? historyPageQuery : 1;
    const limit = (perPage * pageNumber) - perPage;
    const historyLimit = (perPage * historyPageNum) - perPage;
    const q = "SELECT * FROM tickets LEFT JOIN projects ON tickets.ticket_project_id = projects.project_id WHERE tickets.ticket_id = ?; " +
        "SELECT * FROM tickets LEFT JOIN users ON users.user_id = tickets.ticket_user_id WHERE tickets.ticket_id = ?; " +
        "SELECT username, comment, created_at FROM ticket_comments LEFT JOIN users on ticket_comments.user_id = users.user_id WHERE ticket_id = ? ORDER BY created_at DESC LIMIT ?, 5; " +
        "SELECT * FROM ticket_history WHERE ticket_id = ? ORDER BY updated_at DESC LIMIT ?, 5; " +
        "SELECT COUNT(*) AS count FROM ticket_comments WHERE ticket_id = ?; " +
        "SELECT COUNT(*) AS count FROM ticket_history WHERE ticket_id = ?; " +
        "SELECT COUNT(*) AS numRows FROM (SELECT comment_id FROM ticket_comments LEFT JOIN users on ticket_comments.user_id = users.user_id WHERE ticket_id = ? LIMIT ?, 5) AS count; " +
        "SELECT COUNT(*) AS numRows FROM (SELECT * FROM ticket_history WHERE ticket_id = ? ORDER BY updated_at DESC LIMIT ?, 5) AS count";
    connection.query(q, [ticketId, ticketId, ticketId, limit, ticketId, historyLimit, ticketId, ticketId, ticketId, limit, ticketId, historyLimit], (err, results) => {
        if (err) throw err;
        const tickets = results[0];
        const users = results[1];
        const comments = results[2];
        const history = results[3];
        const commentCount = results[4][0].count;
        const historyCount = results[5][0].count;
        const numCommentPages = Math.ceil(commentCount / perPage);
        const numHistoryPages = Math.ceil(historyCount / perPage);
        const numCommentRows = results[6][0].numRows;
        const numHistoryRows = results[7][0].numRows;
        if (!tickets.length) {
            req.flash('error', 'Ticket does not exist!');
            return res.redirect(`/projects/${id}`);
        }
        res.render('tickets/showTicket', { tickets, users, comments, history, id, ticketId, pageQuery, historyPageQuery, numCommentPages, numHistoryPages, current: pageNumber, historyCurrent: historyPageNum, numCommentRows, numHistoryRows });
    });
};

module.exports.renderEditForm = async (req, res) => {
    const { id, ticketId } = req.params;
    connection.query("SELECT * FROM users, projects, tickets WHERE tickets.ticket_id = ? AND projects.project_id = ?;", [ticketId, id], (err, results) => {
        if (err) throw err;
        if (!results.length) {
            req.flash('error', 'Ticket does not exist!');
            return res.redirect(`/projects/${id}`);
        }
        res.render('tickets/editTicket', { results });
    });
};

module.exports.updateTicket = async (req, res) => {
    const { id, ticketId } = req.params;
    const { title, description, status, priority, type, assignee } = req.body
    connection.query("UPDATE tickets SET title = ?, ticket_description = ?, status = ?, priority = ?, type = ?, ticket_project_id = ?, updated_at = ?, assigned_dev = ? WHERE ticket_id = ?",
        [title, description, status, priority, type, id, new Date(), assignee, ticketId],
        (err, results) => {
            if (err) throw err;
            req.flash('success', 'Ticket successfully updated!');
            res.redirect(`/projects/${id}/tickets/${ticketId}`);
        });
};

module.exports.deleteTicket = async (req, res) => {
    const { id, ticketId } = req.params;
    connection.query("DELETE FROM tickets WHERE ticket_id = ?", [ticketId], (err, results) => {
        if (err) throw err;
        req.flash('success', 'Ticket successfully deleted!');
        res.redirect(`/projects/${id}`);
    });
};

module.exports.addComment = async (req, res) => {
    const { id, ticketId } = req.params;
    connection.query("INSERT INTO ticket_comments SET ticket_id = ?, comment = ?, user_id = ?", [ticketId, req.body.comment, req.user.user_id], (err, results) => {
        if (err) throw err;
        req.flash('success', 'Comment successfully added!');
        res.redirect(`/projects/${id}/tickets/${ticketId}`);
    });
};