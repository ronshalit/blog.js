(function(){

angular.module('spaControllers').controller('LoginCtrl', ['$scope','$location', '$rootScope', 'Me',
  function ($scope,$location,$rootScope,  Me) {
    $scope.registering=false;
      $scope.showLogin=false;
      $scope.error='';
    $scope.username='';
    $scope.password = '';
    $scope.logout = function(){
        $scope.error='';
        Me.logout();
        $rootScope.loggedInUser = undefined;
        $scope.showLogin=true; 
        $location.path('/');
    }
    $scope.login = function(){
        login = Me.login({},{username:$scope.username, password:$scope.password}) 
        login.$promise.then(function(loginResult){
            if(loginResult.user)
            $scope.showLogin=false;                
            Me.afterAuthentication(loginResult,$scope,$rootScope)
            $rootScope.$broadcast('loggedIn',[]);
        });
    }
    $scope.register = function(){
        Me.registrationData($scope.username, $scope.password);
        $location.path('/user/register');
    }
    meQuery = Me.query();
    meQuery.$promise.then(function(me){
        if(!me._id){
            $scope.showLogin=true;
        }
        else {
            $rootScope.loggedInUser=me;
            $scope.showLogin=false;
            $scope.name=me.name;
        }
    });
    $rootScope.$on('$routeChangeStart'  , function(event, next, current) {
        $scope.registering=true;
        if ( next.templateUrl !== "partials/register.html") 
            $scope.registering=false;
        
        $scope.showLogin= ($rootScope.loggedInUser == null) ; 
        $scope.name =      $rootScope.loggedInUser ? $rootScope.loggedInUser.name:'';
    });
    
        
  }]);
})();