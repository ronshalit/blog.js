/******************************* api controllers router *****************************
Adds routings for api controllers. The implementation of the controllers should be in the /controllers subdirectory
supports tree types of routes:
1. api/controller/action		: only GET action is supported
2. api/controller				: get / post / put / delete function will be called corresponding to the requested action
3. api/controller/id			: get by id. This will only work when the controller does not implement an action of the same name as the passed id.
							 	  The ID will be passed as the fourth parameter
*************************************************************************************/
var fs = require('fs');
var express = require('express');
var router = express.Router();
var _ = require("underscore");

function loadContorllers(){
	var controllers={};
	var files = fs.readdirSync('./middleware/controllers/');// TODO: get the path from a configs parameter	
	for(var i = 0; i<files.length; i++){
		if(!files[i].match(/\.js$/))
			continue; 
		// run the js in the file and load the exported module into the "actions" object
		var moduleName=files[i].replace('.js','');
		var actions =require('./controllers/'+moduleName); // TODO: get the path from a configs parameter	
		// extend the controllers such that it will include the new controller and all its actions
		var controller={};
		controller[moduleName]=actions;
		controllers = _.extend(controllers, controller);
	}
 
	return controllers;
}

var controllers= loadContorllers();

var output= function(app){

	// create the default api/controller restful actions (get,post,put,delete)
	var verbs = ['get','post','put','delete'];
	for(var i=0; i<verbs.length; i++){
		var verb = verbs[i];
		// use SEAF to keep the relevant verb
		(function(verb){
			app[verb](/^\/api\/([^\/]*)$/, function(req, res, next) {
				var controller = req.params[0];
				// if the controller and verb implementation are found then call them, otherwise let others handle the request
				if( controllers[controller] && controllers[controller][verb])
					controllers[controller][verb](req,res,next);
				else{
					var err = new Error('Not Found');
					err.status = 404;
					next(err);
				}
			
			});
		})(verb);
	}

	// create the default api/controller/action  route
	app.get(/^\/api\/([^\/]*)\/([^\/]*)$/, function(req, res, next) {
		var controller = req.params[0];
		var action = req.params[1];
		// if the controller and action are found then call them, otherwise let others handle the request
		if( controllers[controller] && controllers[controller][action])
			controllers[controller][action](req,res,next);
		else if( controllers[controller] && controllers[controller]["get"])
		    controllers[controller]["get"](req, res, next, action);
		else if (controllers[controller] && controllers[controller]["post"])
		    controllers[controller]["post"](req, res, next, action);
		else if (controllers[controller] && controllers[controller]["put"])
		    controllers[controller]["put"](req, res, next, action);
		else if (controllers[controller] && controllers[controller]["delete"])
		    controllers[controller]["delete"](req, res, next, action);
		else{
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		}
			
	});

    // create the default api/controller/action/variable  route
	app.get(/^\/api\/([^\/]*)\/([^\/]*)\/([^\/]*)$/, function (req, res, next) {
	    var controller = req.params[0];
	    var action = req.params[1];
	    // if the controller and action are found then call them, otherwise let others handle the request
	    if (controllers[controller] && controllers[controller][action])
	        controllers[controller][action](req, res, next,req.params[2]);
	    else {
	        var err = new Error('Not Found');
	        err.status = 404;
	        next(err);
	    }

	});
}
module.exports = output;