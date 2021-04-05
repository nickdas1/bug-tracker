const express = require('express');
const router = express.Router({ mergeParams: true });
const tickets = require('../controllers/tickets');
const { isLoggedIn, isTicketAuthor, canCreate, canEdit } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.route('/newticket')
    .get(isLoggedIn, canCreate, catchAsync(tickets.renderNewForm))
    .post(isLoggedIn, catchAsync(tickets.createTicket));

router.route('/:ticketId')
    .get(isLoggedIn, catchAsync(tickets.showTicket))
    .put(isLoggedIn, canEdit, catchAsync(tickets.updateTicket))
    .delete(isLoggedIn, isTicketAuthor, catchAsync(tickets.deleteTicket));

router.get('/:ticketId/edit', isLoggedIn, canEdit, catchAsync(tickets.renderEditForm));

router.post('/:ticketId/comments', isLoggedIn, catchAsync(tickets.addComment));

module.exports = router;

