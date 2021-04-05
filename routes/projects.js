const express = require('express');
const router = express.Router();
const projects = require('../controllers/projects');
const { isLoggedIn, isAuthor, canCreate } = require('../middleware');
const catchAsync = require('../utils/catchAsync');


router.route('/')
    .get(isLoggedIn, catchAsync(projects.index))
    .post(isLoggedIn, canCreate, catchAsync(projects.createProject));

router.get('/new', isLoggedIn, canCreate, catchAsync(projects.renderNewForm));

router.route('/:id')
    .get(isLoggedIn, catchAsync(projects.showProject))
    .put(isLoggedIn, isAuthor, catchAsync(projects.updateProject))
    .delete(isLoggedIn, isAuthor, catchAsync(projects.deleteProject));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(projects.renderEditForm));

module.exports = router;


