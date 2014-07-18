var fs = require('fs');
var firstLine = /(.*?)(\n|\r)/;

var posts = [
    //{url:"foo", title:"Foo", content:"bar"}
]

var dates=[];
var date2post={};

var path='./BlogPosts/';
// read the blog posts from the files in the BlogPosts directory
var files = fs.readdirSync(path);// TODO: get the path from a configs parameter	
for(var i = 0; i<files.length; i++){
	var url=files[i];
    var content=String.prototype.concat.call(fs.readFileSync(path+url),"");
    // extract the first line as the title and date
    var titleAndDate = content.match(firstLine)[1].split('|');
    var title = titleAndDate[0];
    var date= new Date(titleAndDate[1]).toDateString();

    content = content.replace(firstLine,'').trim();
    
    date2post[date+url]={url:url, title:title, content:content, date:date};
    dates.push(date+url);
}
// sort posts by date descending
dates = dates.sort().reverse();
for(var i=0; i<dates.length; i++){
    posts[i]=date2post[dates[i]];
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
    },
    byUrl:url2post,
    all: posts
}
