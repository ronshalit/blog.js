
    var everyauth = require('everyauth');
    var mongo = require('mongodb');
    var BSON = mongo.BSONPure;
    var usersCollection = 'users';
    function respondToGetMethod (req, res) {
        respond(res, { errors: ['Unsupported HTTP method.'] });
    }
 
    function respondToSucceed (res, user) {
    if (!user) return;
        respond(res, { user: user });
    }
 
    function respondToFail (req, res, errors) {
        if (!errors || !errors.length) return;
        respond(res, { errors: errors });
    }
 
    function respond (res, output) {

        res.contentType('application/json');
        res.send(JSON.stringify(output));
    }

    everyauth.everymodule.userPkey("_id");
    everyauth.everymodule.findUserById( function (req, userId, callback) {
        var users = req.db.collection(usersCollection);
        var userid = new BSON.ObjectID(userId);
	    users.findOne({_id: userid},function(err,user){
            if(user)
                user.password="*******";
            callback(err,user);    
        });
    });

    everyauth.everymodule.logoutPath('/api/me/logout');
    everyauth.everymodule.handleLogout( function (req, res) {
      // Put you extra logic here

      req.logout(); // The logout method is added for you by everyauth, too

      // And/or put your extra logic here
      res.json(true);
    });
everyauth.password
    .extractExtraRegistrationParams( function (req) {
      return {
          name: req.body.name
      };
    })
  .loginFormFieldName('username')
  .getLoginPath('/login') // Uri path to the login page
  .postLoginPath('/api/me/login') // Uri path that your login form POSTs to
  .loginView('a string of html; OR the name of the jade/etc-view-engine view')
  .authenticate( function (username, password, express) {
        var promise = this.Promise();
        var users = express.res.db.collection(usersCollection);
        users.findOne({username: username, password:password}, function (err, user) {
            if (err) 
                 return promise.fulfill([err]);
            if(!user)
                 return promise.fulfill(['Invalid username or password']);
            promise.fulfill(user);
        });
        return promise;
  })
  .loginSuccessRedirect('/') // Where to redirect to after a login
  .getRegisterPath('/register') // Uri path to the registration page
  .postRegisterPath('/api/me/register') // The Uri path that your registration form POSTs to
  .registerView('a string of html; OR the name of the jade/etc-view-engine view')
  .validateRegistration( function (newUserAttributes) {
      return [];
  })
  .registerUser( function (newUserAttributes, express) {
        var promise = this.Promise();
        var users = express.res.db.collection(usersCollection);
        users.findOne({username: newUserAttributes.login}, function (err, user) {
            if(user)
                 return promise.fulfill(['Username already exists']);
            users.insert({username: newUserAttributes.login, password: newUserAttributes.password, name: newUserAttributes.name},function (err, newUser) {
                if (err) 
                    return promise.fulfill([err]);
                if(!newUser || !newUser[0])
                 return promise.fulfill(['Registration Error']);
                promise.fulfill(newUser[0]);
                
            });
            
        });
        return promise;
  })
  .registerSuccessRedirect('/') // Where to redirect to after a successful registration
        .displayRegister(respondToGetMethod)
        .respondToRegistrationSucceed(function(a,res,user){
            respond(res, { user: user });
        })
        .respondToRegistrationFail(respondToFail)
        .displayLogin(respondToGetMethod)
        .respondToLoginSucceed(respondToSucceed)
        .respondToLoginFail(respondToFail);

  module.exports = everyauth.middleware;