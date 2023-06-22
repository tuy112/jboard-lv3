var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'express-database.cjksyhudg2is.ap-northeast-2.rds.amazonaws.com',
    user: 'root',
    password: '1234567890',
    database: 'node_js'
});
db.connect();

module.exports = db;