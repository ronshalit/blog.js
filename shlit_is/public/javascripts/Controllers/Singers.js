(function(){
    angular.module('spaControllers').controller('SingersCtrl', ['$scope', '$rootScope','$location', 'Singer',
    function ($scope, $rootScope,$location, Singer) {
        $scope.showNew = $rootScope.loggedInUser!=null;
        $scope.newSong = function(singerId){
            if(!$rootScope.loggedInUser)
                return;
            $location.path('/songs/new/'+singerId);
        }
        $rootScope.$on('loggedIn',function(){
            $scope.showNew = true;
        });
        $scope.singers = Singer.query();
        
    }]);
})();