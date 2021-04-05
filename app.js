const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/expressError');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(session);
const connection = require('./config/dbConnection');

const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const projectUserRoutes = require('./routes/projectUsers');
const ticketRoutes = require('./routes/tickets');
const roleRoutes = require('./routes/manageRoles');
const dashboardRoutes = require('./routes/dashboard');
const myTicketsRoutes = require('./routes/myTickets');
const profileRoutes = require('./routes/userProfile');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const options = {
    host: process.env.JAWSDBHOST,
    user: process.env.JAWSDBUSER,
    password: process.env.JAWSDBPASSWORD,
    database: process.env.JAWSDBDATABASE
};

const sessionStore = new MySQLStore(options, connection);

const sessionConfig = {
    store: sessionStore,
    name: 'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/projects', projectRoutes);
app.use('/projects/:id/tickets', ticketRoutes);
app.use('/projects/:id/users', projectUserRoutes);
app.use('/manageroles', roleRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/mytickets', myTicketsRoutes);
app.use('/profile', profileRoutes);

app.get('/', catchAsync(async (req, res) => {
    res.redirect('/login');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`SERVING ON PORT ${port}`);
})

