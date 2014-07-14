var evh = require('express-vhost');
var express = require('express');
var server = express();
 
var www = require('./www.js');
var ron = require('./ron.js');

server.use(evh.vhost());


evh.register('localhost', ron);
evh.register('shalit.is', www);
evh.register('www.shalit.is', www);
evh.register('ron.shalit.is', ron);



//app.listen(80);
module.exports = server;
