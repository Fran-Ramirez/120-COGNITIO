angular.module('mainApp').controller('log_prof', ['$scope', '$location', 'servicioProf', function($scope,$location,servicioProf) {
	servicioProf.getProf().then(function(res) {
		if(res.data.exito==true) {
			$location.url("/main_prof");
		}
		else {
			if(res.data.correos == null) {
				$location.url("/");
			}
			else {
				$scope.correos=res.data.correos;
				$scope.user = {};
				$scope.user.dominio=$scope.correos[0];
			}
		}
	});
	
	$scope.submit = function() {
		var datos = {
			correo:$scope.user.correo,
			dominio:$scope.user.dominio,
			password:$scope.user.password
		};
		servicioProf.logProf(datos).then(function(res) {
			if(res.data.exito == true) {
				$location.url('/main_prof');
			}
			else {
				$scope.mensaje = res.data.mensaje;
			}
		});
	};
}]);

angular.module('mainApp').controller('main_prof', ['$scope', '$location', 'servicioProf', function($scope,$location,servicioProf) {
	servicioProf.getTipo().then(function(res) {
		if(res.data.exito == false) {
			servicioProf.logout();
			$location.url('/');
		}
		else {
			if(res.data.tipo == 1) {
				$scope.extras = res.data.extras;
				$scope.titulo = 'Coordinador';
			}
			else {
				$scope.titulo = 'Profesor';
			}
		}
	});
	$scope.ir = function(loc) {
		$location.url(loc);
	};
	$scope.logout = function() {
		servicioProf.logout().then(function(res) {
			if(res.data.exito==true) {
				$location.url('/');
			}
		});
	};
}]);

angular.module('mainApp').controller('subir_cont', ['$scope', '$location', 'servicioProf', function($scope,$location,servicioProf) {
	$scope.cant_cont = [0];
	$scope.contenido = {};
	$scope.contenido['etiqueta'] = [];
	$scope.etiqueta_actual = [];
	$scope.etiquetas = [];
	servicioProf.getTipo().then(function(res) {
		if(res.data.exito == false) {
			servicioProf.logout();
			$location.url('/');
		}
		else {
			if(res.data.tipo == 1) {
				$scope.titulo = 'Coordinador';
			}
			else {
				$scope.titulo = 'Profesor';
			}
		}
	});
	
	servicioProf.getUnidades().then(function(res) {
		if(res.data.exito == false) {
			$location.url('/');
		}
		else {
			$scope.unidades = res.data.unidades;
			$scope.unidades.push({id:-1,titulo:"Nueva unidad"});
			
			$scope.contenido.unidad = -1;
			$scope.topicos = [{id:-1,titulo:"Nuevo topico"}];
			$scope.contenido.topico = -1;
		}
	});
	
	servicioProf.getEtiquetas().then(function(res) {
		if(res.data.exito == false) {
			$location.url('/');
		}
		else {
			$scope.etiquetas = res.data.etiquetas;
			$scope.etiquetas.push({id:-1,nombre_etiqueta:"Escoja una etiqueta",descripcion:"Debe escoger una etiqueta para subir este contenido"});
			$scope.contenido.etiqueta[0] = $scope.etiquetas[$scope.etiquetas.length-1].id;
			$scope.etiqueta_actual[0] = "Debe escoger una etiqueta para subir este contenido";
		}
	});
	
	$scope.actualizarTopicos = function() {
		if($scope.contenido.unidad != -1) {
			servicioProf.cargarUnidad($scope.contenido.unidad).then(function(res){
				if(res.data.exito==true) {
					$scope.topicos = res.data.topicos;
					$scope.contenido.topico = $scope.topicos[0].id;
				}
			});
		}
		else {
			$scope.topicos = [{id:-1,titulo:"Nuevo topico"}];
			$scope.contenido.topico = -1;
		}
	};
	
	$scope.actualizarEtiqueta = function(id) {
		for(var i=0; i<$scope.etiquetas.length;i++) {
			if($scope.etiquetas[i].id == $scope.contenido.etiqueta[id]) {
				$scope.etiqueta_actual[id] = $scope.etiquetas[i].descripcion;
				break;
			}
		}
	};
	$scope.addContenido = function() {
		$scope.cant_cont.push($scope.cant_cont[$scope.cant_cont.length-1]+1);
		$scope.contenido.etiqueta[$scope.cant_cont.length-1] = $scope.etiquetas[$scope.etiquetas.length-1].id;
		$scope.etiqueta_actual[$scope.cant_cont.length-1] = "Debe escoger una etiqueta para subir este contenido";
	};
}]);

//subir__Imagen

angular.module('mainApp').controller('subir__Imagen', ['$scope', 'ngDialog', 'Upload', function($scope,ngDialog,Upload) {
	$scope.image = 'imagenes/default.jpg';

	$scope.progreso = 0;
	$scope.estado = {diseno:'text-danger',txt:"Nada por subir"};
	
	$scope.upload = function(file) {
		if(file.length == 1){
			Upload.upload({url:'/prof_panel/subir_foto_contenido',method:'POST',data:{userFoto:file[0]}})
			.then(function(resp){
					//exito
					$scope.estado = {diseno:'text-success',txt:"Imagen subida, ahora se puede insertar"};
					$scope.image = resp.data.img;
				},
				function(resp){
					//fallo
					console.log('Error status: ' + resp.status);
				},
				function(evt){
					$scope.estado = {diseno:'text-warning',txt:"Subiendo imagen"};
					progreso = parseInt(100.0 * evt.loaded / evt.total);
				}
			);
		}
	}
	$scope.insertar = function() {
		this.closeThisDialog($scope.image);
	};
	$scope.cancelarOp = function() {
		
		this.closeThisDialog("$escape");
	};
	
}]);
