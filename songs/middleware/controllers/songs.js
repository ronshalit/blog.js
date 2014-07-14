var mongo = require('mongodb');
var BSON = mongo.BSONPure;

module.exports = {
    'by':function(req,res,next,userId){ 

	    var songs = res.db.collection("songs");
	    songs.find({ 'by._id': new BSON.ObjectID(userId) }, function (err, by) { by.toArray(function (err, arr) { res.json(arr); })});
	},
	'get': function (req, res, next, id) {
		if(id){
		    var songs = res.db.collection("songs");

		    var o_id = new BSON.ObjectID(id);
			songs.findOne({_id: o_id},function(err,prod){	res.json(prod);	});	
		} else {
			var songs = res.db.collection("songs");
			songs.find().toArray(function(err,arr){	res.json(arr);	});
		}
	},
    'post': function (req, res, next) {
		if(req.user && req.body.title && req.body.lyrics){
		    var songs = res.db.collection("songs");
            req.user.name = req.user.name || req.user.username;
            res.db.collection("users").findOne({_id: new BSON.ObjectID(req.body.singerId)},function(err,singer){
                if(err)
                    res.json(err);
                singer.numOfSongs++;
                res.db.collection("users").update({_id: new BSON.ObjectID(req.body.singerId)}, singer, function(){});    	
                songs.insert({title: req.body.title , lyrics:req.body.lyrics, by: req.user, "for":singer},function(err,prod){
                                	res.json({id:prod[0]._id.toString()});	
                                });	
            });            			
		} 
        else
            res.json(null);
	}
};   