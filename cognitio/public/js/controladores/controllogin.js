angular.module('mainApp').controller('controllogin', ['$scope','$rootScope','$location','servicioInicio',function($scope,$rootScope,$location,servicioInicio) {
	servicioInicio.get().then(function(res){
		if(res.data.exito==true) {
			$location.url('/main');
		}
		else {
			if(res.data.correos == null) {
				$location.url('/prof_login');
			}
			else {
				$scope.correos=res.data.correos;
				$scope.user = {};
				$scope.user.dominio=$scope.correos[0];
			}
		}
	});

}]);

angular.module('mainApp').controller('log', ['$scope','$location','servicioInicio',function($scope,$location,servicioInicio) {
	$scope.registro = function() {
		$location.url("/registro");
	};
	$scope.submit = function() {
		var datos = {
			correo:$scope.user.correo,
			dominio:$scope.user.dominio,
			password:$scope.user.password
		};
		servicioInicio.log(datos).then(function(res) {
			if(res.data.exito == true) {
				$location.url("/main");
			}
			else {
				$scope.mensaje = res.data.mensaje;
			}
		});
	};
	$scope.profl = function() {
		$location.url("/prof_login");
	};
}]);

angular.module('mainApp').controller('reg', ['$scope','$location','servicioInicio',function($scope,$location,servicioInicio) {
	$scope.ingreso = function() {
		$location.url("/");
	}
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
