if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mysql = require('mysql');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     multipleStatements: true
// });

// const connection = mysql.createPool({
//     host: 'us-cdbr-east-03.cleardb.com',
//     user: 'b728b897ed6f3f',
//     password: '6233a1fb',
//     database: 'heroku_86cf96b9bd6e888',
//     multipleStatements: true
// });


const connection = mysql.createPool({
    host: 'vkh7buea61avxg07.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'lb3b9c0qtk3irjkv',
    password: 'zvixroqusrz5ofh1',
    database: 'iyfq1zehpobjsrch',
    multipleStatements: true
});

// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('MYSQL CONNECTION OPEN');
// });

module.exports = connection;