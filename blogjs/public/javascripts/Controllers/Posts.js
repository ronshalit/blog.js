(function(){
    angular.module('spaControllers').controller('PostsCtrl', ['$scope', '$routeParams', 'Post',
    function ($scope, $routeParams, Post) {
        $scope.firstTwoRows = function (s) { return Post.toRows(s).slice(0, 2) };
        $scope.posts = Post.query();        
    }]);
})();