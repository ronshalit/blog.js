function isBot(req){
    // we assume that bots do not pass the accept-language header
    return !req.headers["accept-language"];
}
// wraps the original middleware functiona call with one that checks for bots
function wrapper(orig){
    return function(req,res,next){
        if(!isBot(req))
            next();
        else
            orig(req,res,next);
    }
}
// calls a routing method in app
function callApp(app, method){
    return function(a,b){
        if(typeof a !== "function")
            app[method](a,wrapper(b));            
        else
            app[method](wrapper(a));
    }
}
// bot routing
module.exports= function(app){
    return {
        use:callApp(app,"use"),
        get:callApp(app,"get")
    }
}
