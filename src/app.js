
var express = require('express');
var cors = require('cors');

var path = require('path');
var mysql = require('mysql');
var app = express();

var player = [express.static(path.resolve(__dirname , '../../player')), (req, res) => res.sendFile(__dirname , '../../player/index.html')];


const api = express.Router();
api.get('/item/:route', function (req, res) {
    console.log(req, res, "in readGameRecord");
    pool = mysql.createPool({
        connectionLimit: 10,
        host: DB_CONFIG.HOST,
        user: DB_CONFIG.USERNAME,
        password: DB_CONFIG.PASSWORD,
        database: DB_CONFIG.DBNAME
    });
    pool.getConnection(function (err, connection) {
        // connected! (unless `err` is set)
    });
    pool.on('connection', function (connection) {
        console.log("connected");
        connection.query({
            sql: 'SELECT * FROM `games` WHERE `route` = ?',
            timeout: 2000, // 2s
            values: [req.params.route]
        }, function (error, results, fields) {
            if (results) {
                res.send(results && results[0] && results[0].value)
            }
            console.log(error);

        })
    });
});
const DB_CONFIG = {
    "HOST": "platformedb.c9vmaegoysdi.us-east-2.rds.amazonaws.com",
    "USERNAME": "platformedb",
    "PASSWORD": "1q2w3e4r",
    "DBNAME": "platforme"
};

app.use(cors());
app.use('/api/', api);
app.use('/office/', player);
app.use('/jungle/', player);
app.use(player);
module.exports = app;

