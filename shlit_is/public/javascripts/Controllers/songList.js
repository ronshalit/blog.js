(function(){
    angular.module('spaControllers').controller('SongsListCtrl', ['$scope', '$routeParams', 'Song',
    function ($scope, $routeParams, Song) {
        $scope.firstTwoRows = function (s) { return Song.toRows(s).slice(0, 2) };
        if (!$routeParams.userId)
            $scope.songs = Song.query();
        else
            $scope.songs = Song.by({ by: $routeParams.userId });
    }]);
})();