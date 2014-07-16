var services = angular.module('services', ['ngResource']);

services.factory('Post', ['$resource','$sce',
  function($resource,$sce){
    var post= $resource('api/posts/:postUrl', {}, {
        query: { method: 'GET', params: { postUrl: '' }, isArray: true }
    });
    post.html=function(p){
        return $sce.trustAsHtml(p.replace(/\n/g, '<br>'));
    }
    return post;
  }]);

  
