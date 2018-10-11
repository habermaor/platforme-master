
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
var path = require('path');
var mysql = require('mysql');
var app = express();
app.use(bodyParser.json({ limit: '50mb' }));

var player = [express.static(path.resolve(__dirname, '../../player')), (req, res) => res.sendFile(__dirname, '../../player/index.html')];
var editor = [express.static(path.resolve(__dirname, '../../editor')), (req, res) => res.sendFile(__dirname, '../../editor/index.html')];

const api = express.Router();
api.get('/item/:id', function (req, res) {

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
            sql: 'SELECT * FROM `games` WHERE `id` = ?',
            timeout: 20000, // 20s
            values: [req.params.id]
        }, function (error, results, fields) {
            if (results) {
                res.send(results && results[0] && results[0].value)
            }
           

        })
    });
});
api.post('/create', function (req, res) {

    //here we  save the image on disk + replacing the base64 to file location
    var base64Data = req.body.assets.hero.url.replace(/^data:image\/png;base64,/, "");
    var fileName = Date.now() + '.png';
    const filePath = path.resolve(__dirname, '../../player/assets/');
    require("fs").writeFile(filePath + '/' + fileName, base64Data, 'base64', (err) => {
        if (err) throw err;
        req.body.assets.hero.url = req.headers.origin + '/player/assets/' + fileName;
    });
    if (req.body.assets.enemies[0].url.substring(0, 21) == 'data:image/png;base64')
    {
        var enemyBase64Data = req.body.assets.enemies[0].url.replace(/^data:image\/png;base64,/, "");
        var enemyFileName = Date.now() + '_enemy.png';
        require("fs").writeFile(filePath + '/' + enemyFileName, enemyBase64Data, 'base64', (err) => {
            if (err) throw err;
            req.body.assets.enemies[0].url = req.headers.origin + '/player/assets/' + enemyFileName;
        });
    }
    ///
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
        console.log("connected in create item");
        var game = {
            author_id: 999, //TODO - use user id
            route: Math.random().toString(36).substring(7), //TODO - check if exists..
            value: JSON.stringify(req.body)
        }
        connection.query('INSERT INTO games SET ?', game, function (err, result) {
            if (result) {
                res.send(result)
            }
            else
                console.log(err);
        });
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
app.use('/editor/', editor);
app.use('/player/', player);
app.use(player);
module.exports = app;

