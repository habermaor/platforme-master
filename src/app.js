var express = require('express');
var path = require('path');


var app = express();



var //editor = [express.static(path.resolve(__dirname, '../../platforme-editor/')), (req, res) => res.sendFile(path.resolve(__dirname, '../../platforme-editor/index.html'))],
    player = [express.static(path.resolve(__dirname , '../../player')), (req, res) => res.sendFile(__dirname , '../../player/index.html')];



app.get('/', player);
//app.get('/editor', editor);
app.use(player);



//app.listen(3000);
module.exports = app;

