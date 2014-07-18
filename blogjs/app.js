
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var api = require('./middleware/apiControllers');
var session = require("express-session");
var app = express();
var posts = require("./middleware/controllers/posts");
var bots = require("./middleware/bots.js")(app);
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

///////// bots behavior ///
// posts
bots.get(/^\/posts\/([^\/]+)$/,function (req,res,next){     
    var post = posts.byUrl[req.params[0]];
    post.description = post.content.match(/(.*?)(\n|\r)/)[0];
    res.render("post",post); 
});

// image files
bots.get(/.*images\/(.*)$/, function(req, res, next){
    res.sendfile("public/images/"+req.params[0], {posts: posts.all});
});

// all the rest get the homepage
bots.use(function(req, res, next){
    res.render("homepage", {posts: posts.all});
});
// end bot behavior 

// api controllers (api/controller/...)
api(app); 

// otherwise serve files from the static files folder
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/posts', express.static(path.join(__dirname, 'public'))); 


app.use(function(req,res){
  res.sendfile('public/index.html');
});



//app.listen(80);
module.exports = app;
