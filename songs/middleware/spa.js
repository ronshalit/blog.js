/*********************** single page application middleware **************************
 This module provides functionality to support single page applications in node.js
 spa.start(expressApp, options)  loads and generates an html layout that links to all the templates, js, and styles

 The layout html file recognizes four placeholders:
	1. {styles}		will be replaced with link tags for all the css files that were found. only one supported.
	2. {templates}	will be replaced with the html contents of all the templates. only one supported.
	3. {scripts}	.. script tags for all the found script files. only one supported.
	4. {root}		this is calculated at the time of the request, each occorance of {root} will be replaced
					with the relative path of the root (relative to the requested url)
**************************************************************************************/
var fs = require('fs');
var _= require('underscore');
var path = require('path');

function loadViewTemplates(viewsPath, layoutFilename){
	var layout = "";
	function loadViewTemplatesRecursive(viewsPath){
		// concatanate the views templates
		var files = fs.readdirSync(viewsPath);
		var views="";

		for(var i = 0; i<files.length; i++){
			fileStat = fs.statSync(viewsPath+files[i]);
			// recuresively append directories' content as well
			if(fileStat.isDirectory())
				views+=loadViewTemplatesRecursive(viewsPath+files[i]+'/');
			// if this is a file just read its contents
			else if(files[i] != layoutFilename)
				views+=fs.readFileSync(viewsPath+files[i],{encoding:'utf-8'})+'\n';
			else layout = fs.readFileSync(viewsPath+files[i],{encoding:'utf-8'})+'\n';
		}

		return views;
	}

	return { 
		views: loadViewTemplatesRecursive(viewsPath), 
		layout: layout
	}
}

function loadStyles(path){
	var styles = "";
	var files = fs.readdirSync(path);
	for(var i = 0; i<files.length; i++){
		fileStat = fs.statSync(path+files[i]);
		// recuresively append directories' content as well
		if(fileStat.isDirectory())
			styles+=loadStyles(path+files[i]+'/');
		// if this is a file just read its contents
		else
			styles += '<link href="{root}'+path+files[i]+'" rel="stylesheet" type="text/css" type="text/css"/>\n';
	}
	return styles;
}

function loadScripts(path){
	var scripts = "";
	var files = fs.readdirSync(path).sort();
	for(var i = 0; i<files.length; i++){
		fileStat = fs.statSync(path+files[i]);
		// recuresively append directories' content as well
		if(fileStat.isDirectory())
			scripts+=loadScripts(path+files[i]+'/');
		// if this is a file just read its contents
		else
			scripts += "<script type='text/javascript' src='{root}"+path+files[i]+"' ></script>\n";
	}
	return scripts;
}

var settings = {
	viewsPath:'./public/views/',
	layoutFilename:'layout.htm', 
	scriptsPath:'public/javascripts/',
	stylesPath:'public/stylesheets/'
}

// export the module
spa = {
	/*
		Starts the single page application.
		app: the express server object
		options: an optional configuration object to change the defaults
	*/
	start: function(app, options){
		settings = _.extend(settings, options);
		var templates = loadViewTemplates(settings.viewsPath, settings.layoutFilename);
		var styles = loadStyles(settings.stylesPath);
		var scripts = loadScripts(settings.scriptsPath);

		var html = templates.layout
						.replace("{styles}", styles)
						.replace("{templates}", templates.views)
						.replace("{scripts}", scripts);

		app.use( function(req,res,next){
			res.send(html.replace(/\{root\}/g, path.relative(req.path, '/').replace(/\\/g,'/') + '/'));
		});
	}
}
module.exports = spa;
