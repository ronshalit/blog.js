(function(){

angular.module('spaControllers').controller('RegisterCtrl', ['$scope', '$rootScope','$timeout', 'Me',
  function ($scope, $rootScope, $timeout, Me) {
    var data = Me.registrationData();
    $scope.error='';
    $scope.username=data.username;
    $scope.password = data.password;
    $scope.name='';
    $scope.focusName=!!data.username && !!data.password;
    $timeout(function(){
        if(!!data.username && $scope.form.email.$invalid){
            $scope.focusName=false;
        }
    })
    $scope.formClass='';
    $scope.register = function(){
        $scope.formClass='submitted';
        if($scope.form.$invalid)
            return;
        register = Me.register({},{username:$scope.username, password:$scope.password, name:$scope.name}) 
        register.$promise.then(function(loginResult){
            Me.afterAuthentication(loginResult,$scope, $rootScope)  
            if(loginResult.user)          
            window.history.back();
        });
    }    
        
  }]);


})();