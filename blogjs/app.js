
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var api = require('./middleware/apiControllers');
var session = require("express-session");
var app = express();
 

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
 


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('foo'))
   .use(session());


// api controllers (api/controller/...)
api(app); 

// default route - get index.htm
app.get("/",function(req,res){
  res.sendfile('public/index.html');
});

// otherwise serve files from the static files folder
app.use('/', express.static(path.join(__dirname, 'public'))); 


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
