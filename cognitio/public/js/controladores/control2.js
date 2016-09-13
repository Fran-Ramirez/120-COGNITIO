angular.module('mainApp').controller('control2', ['$scope','$rootScope','num2',function($scope,$rootScope,num2) {
	num2.get().then(function(res){
		console.log(res);
	});
    $scope.tagline = 'Nothing beats a pocket protector!';

}]);
