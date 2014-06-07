module.exports = {
    get:function(req,res,next){
        if(req.user)
            res.json(req.user);
        else
            res.json(null);
    }
}