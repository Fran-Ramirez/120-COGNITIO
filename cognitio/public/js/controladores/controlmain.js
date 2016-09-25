angular.module('mainApp').controller('controlMain',['$scope','$rootScope','$location','servicioPrincipal',function($scope,$rootScope,$location,servicioPrincipal) {
	servicioPrincipal.getTest().then(function(res) {
		if(res.data.exito == -1) {
			$location.url('/');
		}
		if(res.data.test == false) {
			console.log('asd');
			$location.url('/test');
		}
	});
}]);

angular.module('mainApp').controller('controlTest',['$scope','$rootScope','$location','servicioPrincipal',function($scope,$rootScope,$location,servicioPrincipal) {
	servicioPrincipal.getTest().then(function(res) {
		if(res.data.test == true) {
			$location.url('/main');
		}
	});
}]);
