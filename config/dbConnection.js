if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('MYSQL CONNECTION OPEN');
});

module.exports = connection;