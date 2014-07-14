var services = angular.module('services', ['ngResource']);

services.factory('Post', ['$resource',
  function($resource){
    var post= $resource('api/posts/:postUrl', {}, {
        query: { method: 'GET', params: { postUrl: '' }, isArray: true }
    });
    post.toRows=function (str) {
        if(str)
            return str.split('\n');
    }
    return post;
  }]);

  
