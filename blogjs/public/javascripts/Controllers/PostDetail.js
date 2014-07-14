(function(){
    angular.module('spaControllers').controller('PostDetailCtrl', ['$scope', '$routeParams', 'Post',
      function ($scope, $routeParams, Post) {
        $scope.rows = Post.toRows; 
	    $scope.postUrl = $routeParams.postUrl;
        $scope.post=Post.get({postUrl: $routeParams.postUrl});
    }]);
})();