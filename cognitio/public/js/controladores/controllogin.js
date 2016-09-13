angular.module('mainApp').controller('controllogin', ['$scope','$rootScope','servicioInicio',function($scope,$rootScope,servicioInicio) {
	servicioInicio.get().then(function(res){
		if(res.data.exito==true) {
			console.log('bien');
		}
		else {
			$scope.correos=res.data.correos;
			$scope.user = {};
			$scope.user.dominio=$scope.correos[0];
		}
	});

}]);

angular.module('mainApp').controller('log', ['$scope','$location','servicioInicio',function($scope,$location,servicioInicio) {
	$scope.registro = function() {
		$location.url("/registro");
	}
	$scope.submit = function() {
		var datos = {
				correo:$scope.user.correo,
				dominio:$scope.user.dominio,
				password:$scope.user.password
		};
		servicioInicio.log(datos).then(function(res) {
			$scope.mensaje=res.data.mensaje;
		});
	}
}]);

angular.module('mainApp').controller('reg', ['$scope','servicioInicio',function($scope,servicioInicio) {
	$scope.submit = function() {
		var datos = {
				correo:$scope.user.correo,
				dominio:$scope.user.dominio,
				rol:$scope.user.rol,
				password:$scope.user.password
		};
		servicioInicio.create(datos).then(function(res) {
			$scope.mensaje=res.data.mensaje;
		});
	}
	
}]);
