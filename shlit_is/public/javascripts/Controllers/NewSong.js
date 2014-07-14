(function(){

angular.module('spaControllers').controller('NewSongCtrl', ['$scope', '$routeParams','$location', '$rootScope', 'Song',
  function ($scope, $routeParams, $location, $rootScope, Song) {
    if(!$rootScope.loggedInUser)
        $location.path('/');
    
    $scope.title= '';
    $scope.lyrics='';
    $scope.save =function(){
        Song.save({},{title: $scope.title, lyrics: $scope.lyrics, singerId:$routeParams.singerId}).$promise.then(function(song){
            if(song.id)
                $location.path('/songs/'+song.id);
            else
                alert("Error saving song.");
        });
    }
  }]);
})();