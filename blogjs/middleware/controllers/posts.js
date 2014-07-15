var fs = require('fs');
var firstLine = /(.*?)(\n|\r)/;

var posts = [
    //{url:"foo", title:"Foo", content:"bar"}
]

var path='./BlogPosts/';
// read the blog posts from the files in the BlogPosts directory
var files = fs.readdirSync(path);// TODO: get the path from a configs parameter	
for(var i = 0; i<files.length; i++){
	var url=files[i];
    var content=String.prototype.concat.call(fs.readFileSync(path+url),"");
    // extract the first line as the title
    var title = content.match(firstLine)[1];
    content = content.replace(firstLine,'');
    posts.push({url:url, title:title, content:content});
}

// keep the posts in a dictionary, too, for easy extractions
var url2post = {}
for(var i=0; i<posts.length; i++){
    url2post[posts[i].url]=posts[i];
}

module.exports = {
    get:function(req,res,next,url){
        if(url)
            return res.send( url2post[url]);
        res.send(posts);
    }
}