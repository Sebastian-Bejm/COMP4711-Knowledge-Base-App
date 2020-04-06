const mysql = require('mysql2');

// url:  mysql://bf02fe50141e00:863bb7b4@us-cdbr-iron-east-01.cleardb.net/heroku_11bab956933f1d3?reconnect=true

const pool = mysql.createPool({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bf02fe50141e00',
    database: 'heroku_11bab956933f1d3',
    password: '863bb7b4',
    multipleStatements: true
});

module.exports = pool.promise();