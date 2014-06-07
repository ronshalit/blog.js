(function(){
    angular.module('spaControllers').controller('SongDetailCtrl', ['$scope', '$routeParams', 'Song',
      function ($scope, $routeParams, Song) {
        $scope.rows = Song.toRows; 
	    $scope.songId = $routeParams.songId;
        $scope.song=Song.get({songId: $routeParams.songId});
    }]);
})();