

var spa = angular.module('spaApp', [
  'ngRoute',
  'spaControllers',
  'services'
]);
 
spa.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider) {
      $routeProvider.          
      when('/posts', {
        templateUrl: 'partials/posts.html',
        controller: 'PostsCtrl'
      }).     
      when('/posts/:postUrl', {
        templateUrl: 'partials/post-detail.html',
        controller: 'PostDetailCtrl'
      }).
      otherwise({
        redirectTo: '/posts'
      });
  }]);


// implement the ng-focus directive
spa.directive('ngFocus', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      scope.$watch(attrs.ngFocus, function(value) {
        if(value === true) {           
            // use timeout because the rootScope is already in process
            $timeout(function(){
                element[0].focus()
            });            
        }
      });
    }
  };
});