const connection = require('./config/dbConnection');
const { roles } = require('./config/roles');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must log in first!');
        return res.redirect('/login');
    }
    next();
}

const isAuthor = (req, res, next) => {
    const { id } = req.params;
    connection.query("SELECT * FROM projects WHERE project_id = ?", [id], (err, results) => {
        if (results[0].project_user_id !== req.user.user_id) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/projects/${id}`);
        }
        next();
    })
}

const isTicketAuthor = (req, res, next) => {
    const { id, ticketId } = req.params;
    connection.query("SELECT * FROM tickets WHERE ticket_id = ?", [ticketId], (err, results) => {
        if (results[0].ticket_user_id !== req.user.user_id) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/projects/${id}/tickets/${ticketId}`);
        }
        next();
    })
}

const authCreate = (user) => {
    return (
        user.role === roles.admin ||
        user.role === roles.manager ||
        user.role === roles.developer ||
        user.role === roles.submitter
    )
}

const authEdit = (user) => {
    return (
        user.role === roles.admin ||
        user.role === roles.manager ||
        user.role === roles.developer
    )
}

const authAssign = (user) => {
    return (
        user.role === roles.admin ||
        user.role === roles.manager
    )
}

const canCreate = (req, res, next) => {
    if (!authCreate(req.user)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/dashboard');
    }
    next();
}

const canEdit = (req, res, next) => {
    if (isTicketAuthor) {
        return next();
    } else if (!authEdit(req.user) || !isTicketAuthor) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/dashboard');
    }
    next();
}

const canAssign = (req, res, next) => {
    if (!authAssign(req.user)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/dashboard');
    }
    next();
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== roles.admin || req.user.username === 'Demo_Admin') {
        req.flash('error', 'Non-Admins and Demo Admins do not have permission to do that.');
        return res.redirect('/dashboard');
    }
    next();
}


module.exports = {
    isLoggedIn,
    isAuthor,
    isTicketAuthor,
    canCreate,
    canEdit,
    canAssign,
    isAdmin
}