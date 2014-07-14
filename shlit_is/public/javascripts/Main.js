

var spa = angular.module('spaApp', [
  'ngRoute',
  'spaControllers',
  'services'
]);
 
spa.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider) {
	//  $locationProvider.html5Mode(true);
      $routeProvider.
          when('/home', {
              templateUrl: 'partials/home.html',
              controller: 'HomeCtrl'
          }).
        when('/user/register', {
              templateUrl: 'partials/register.html',
              controller: 'RegisterCtrl'
          }).
      when('/songs', {
        templateUrl: 'partials/songs.html',
        controller: 'SongsListCtrl'
      }).
      when('/singers', {
        templateUrl: 'partials/singers.html',
        controller: 'SingersCtrl'
      }).
      when('/songs/new/:singerId', {
              templateUrl: 'partials/insert.html',
              controller: 'NewSongCtrl'
          }).
      when('/songs/by/:name/:userId', {
          templateUrl: 'partials/songs.html',
          controller: 'SongsListCtrl'
      }).
      when('/songs/:songId', {
        templateUrl: 'partials/song-detail.html',
        controller: 'SongDetailCtrl'
      }).
      otherwise({
        redirectTo: '/singers'
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