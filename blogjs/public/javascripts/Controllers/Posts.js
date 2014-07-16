(function(){
    angular.module('spaControllers').controller('PostsCtrl', ['$scope', '$routeParams', 'Post',
    function ($scope, $routeParams, Post) {
        $scope.posts = Post.query(); 
        $scope.firstRow= function(p){ 
            var firstRow = p.match(/(.*)(\r|\n)/);
            return Post.html(!firstRow?p:firstRow[0])
        }
        $scope.date = function(d){return !d?"": new Date(d).toDateString()}
    }]);
})();
