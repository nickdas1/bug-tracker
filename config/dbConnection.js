if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.JAWSDB_HOST,
    user: process.env.JAWSDB_USER,
    password: process.env.JAWSDB_PASSWORD,
    database: process.env.JAWSDB_DATABASE,
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
