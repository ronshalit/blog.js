var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var spa = require('./middleware/spa');
var api = require('./middleware/apiControllers');
var MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server;
var session = require("express-session");
var authentication = require('./middleware/authentication.js');
var app = express();
 
var mongoClient = new MongoClient(new Server('localhost', 27017));

// The `consolidate` adapter module  
var cons = require('consolidate');
app.set('views', './views');

// .hbs files should be handled by `handlebars`
// `consolidate` takes care of loading `handlebars` and interfacing it with Express
app.engine('hbs', cons.handlebars);
// we set 'hbs' as the default extension of template files
// this is optional, but you have to specify the view files's extension if you don't
// it defaults to 'jade'
app.set('view engine', 'hbs');
 
// add a reference for the DB connection in the response object 
app.use(function(req,res,next){ 
	MongoClient.connect("mongodb://localhost:27017/songs", function(err, db) {
		res.db = db;      	
        req.db=db;
		res.on('finish',function(){ db.close();console.log(4);});
		next();
	})
});


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('songs'))
   .use(session())
   .use(authentication(app));


// api controllers (api/controller/...)
api(app); 

// default route - get index.htm
app.get("/",function(req,res){
  res.sendfile('public/index.htm');
});

// otherwise serve files from the static files folder
app.use('/', express.static(path.join(__dirname, 'public'))); 



// single page application content
/*spa.start(app,{
	viewsPath:'./public/views/',
	layoutFilename:'layout.htm', 
	scriptsPath:'public/javascripts/',
	stylesPath:'public/stylesheets/'
});*/

/// catch 404 and forwarding to error handler (nothing should get here- the SPA will catch everything)
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});




/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//app.listen(80);
module.exports = app;
