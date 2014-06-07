var services = angular.module('services', ['ngResource']);

services.factory('Song', ['$resource',
  function($resource){
    var song= $resource('api/songs/:songId/:by', {}, {
        query: { method: 'GET', params: { songId: '' }, isArray: true },
        by: { method: 'GET', params: { songId: 'by' }, isArray: true },
        save:{ method: 'POST', params: { songId: '' }, isArray: false }
    });
    song.toRows=function (str) {
        if(str)
            return str.split('\n');
    }
    return song;
  }]);

 services.factory('Me', ['$resource', '$rootScope',
  function($resource, $rootScope){
    var me = $resource('api/me/:action', {}, {
      login: {method:'POST', params:{action:'login'}, isArray:false},
      register: {method:'POST', params:{action:'register'}, isArray:false},
      query: {method:'GET', params:{action:''}, isArray:false},
      logout: {method:'GET', params:{action:'logout'}, isArray:false},
    });
    
    var _username='';
    var _password='';
    me.registrationData = function(username,password){
        if(arguments.length===0)
            return {username:_username, password:_password};
        _username = username;
        _password = password;
    }

    me.onRegistered = function(fn){
        if(typeof fn === 'function')
            return $rootScope.$on("registerEvent", fn)            
        $rootScope.$broadcast('registerEvent');
    }
    me.afterAuthentication=function (loginResult,$scope,$rootScope){
        $scope.error='';
        if(loginResult.user){
            $rootScope.loggedInUser = loginResult.user;
            $scope.name = loginResult.user.name;
        }
        if(loginResult.errors)
            $scope.error = loginResult.errors.join(', ');
    }
    return me;
  }]);
