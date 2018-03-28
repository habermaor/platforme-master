
var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();

var //editor = [express.static(path.resolve(__dirname, '../../platforme-editor/')), (req, res) => res.sendFile(path.resolve(__dirname, '../../platforme-editor/index.html'))],
    player = [express.static(path.resolve(__dirname , '../../player')), (req, res) => res.sendFile(__dirname , '../../player/index.html')];



const api = express.Router();
api.get('/item/:route', readGameRecord);

const DB_CONFIG = {
    "HOST": "platformedb.c9vmaegoysdi.us-east-2.rds.amazonaws.com",
    "USERNAME": "platformedb",
    "PASSWORD": "1q2w3e4r",
    "DBNAME": "platforme"
};



function readGameRecord(route) {
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
       
        connection.query({
            sql: 'SELECT * FROM `games` WHERE `route` = ?',
            timeout: 10000, // 10s
            values: [route.params.route]
        }, function (error, results, fields) {
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            console.log(results)
            //WORKING! - know we're left with passing this JSON to the platforme-player!
            //if i want it as simple as possible, we could acctualy move the entire server into 'platforme-player', and do the DB quering as a part of a game.state
            // fields will contain information about the returned results fields (if any)
        })
    });
}



//app.get('/', player);
//app.get('/editor', editor);
app.use('/api/', api);
app.use(player);



//app.listen(3000);
module.exports = app;

