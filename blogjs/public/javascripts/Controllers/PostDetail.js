(function(){
    angular.module('spaControllers').controller('PostDetailCtrl', ['$scope', '$routeParams', 'Post',
      function ($scope, $routeParams, Post) {
        
	    $scope.postUrl = $routeParams.postUrl;
        $scope.post=Post.get({postUrl: $routeParams.postUrl});
        $scope.html = function(c){return !c?"":Post.html(c)}
        $scope.date = function(d){return new Date(d).toDateString()}       
        
    }]);
})();
