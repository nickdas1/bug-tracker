const bcrypt = require('bcryptjs');
const connection = require('../config/dbConnection');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser((id, done) => {
        connection.query("SELECT * FROM users WHERE user_id = ?", [id], (err, results) => {
            done(err, results[0]);
        });
    });


    passport.use('local', new LocalStrategy({
        username: 'username',
        password: 'password',
        passReqToCallback: true
    },
        async function (req, username, password, done) {
            connection.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
                if (err) return done(err);
                if (!results.length) return done(null, false, req.flash('error', 'Username or password is incorrect.'));

                const passwordCheck = await bcrypt.compare(password, results[0].password);
                if (!passwordCheck) return done(null, false, req.flash('error', 'Username or password is incorrect.'));
                req.flash('success', 'Welcome Back!');
                return done(null, results[0]);
            })
        }
    ))

    passport.use('demo', new LocalStrategy({
        username: 'username',
        password: 'password',
        passReqToCallback: true
    },
        async function (req, username, password, done) {
            connection.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
                if (err) return done(err);
                if (!results.length) return done(null, false, req.flash('error', 'Username or password is incorrect.'));

                const passwordCheck = await bcrypt.compare(password, results[0].password);
                if (!passwordCheck) return done(null, false, req.flash('error', 'Username or password is incorrect.'));
                req.flash('success', 'Welcome Back!');
                return done(null, results[0]);
            })
        }
    ))
    
};