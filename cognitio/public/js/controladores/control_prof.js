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

angular.module('mainApp').controller('subir_cont', ['$scope', 'ngDialog', '$location', 'servicioProf', function($scope,ngDialog,$location,servicioProf) {
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
			
	/*[INICIO]------------------Variables------------------*/
			$scope.contenido = [];
			$scope.unidades = [];
			$scope.topicos = [];
			$scope.etiquetas = [];
			$scope.todos = {};
	/*[FIN]------------------Variables------------------*/	

	/*[INICIO]------------------CARGA UNIDADES------------------*/
			servicioProf.getUnidades().then(function(res) {
				if(res.data.exito == false) {
					$location.url('/');
				}
				else {
					$scope.unidades = res.data.unidades;
					$scope.unidades.push({id:-1,titulo:"Nueva unidad"});
					$scope.topicos = [{id:-1,titulo:"Nuevo topico"}];
					//topico unidad por defecto
					$scope.todos['unidad'] = -1;
					$scope.todos['topico'] = -1;
				/*[INICIO]------------------CARGA ETIQUETAS------------------*/
					servicioProf.getEtiquetas().then(function(res) {
						if(res.data.exito == false) {
							$location.url('/');
						}
						else {
							$scope.etiquetas = res.data.etiquetas;
							$scope.etiquetas.push({id:-1,nombre_etiqueta:"Escoja una etiqueta",descripcion:"Debe escoger una etiqueta para subir este contenido"});
							
							$scope.contenido.push(
								{
									titulo:"",
									etiqueta:$scope.etiquetas[$scope.etiquetas.length-1].id,
									desc_etiq:"Debe escoger una etiqueta para subir este contenido",
									texto:""
								}
							);
							
						}
					});
				}
			});
		}
	});

	$scope.actualizarTopicos = function() {
		if($scope.todos.unidad != -1) {
			servicioProf.cargarUnidad($scope.todos.unidad).then(function(res){
				if(res.data.exito==true) {
					$scope.topicos = res.data.topicos;
					$scope.todos.topico = $scope.topicos[0].id;
				}
			});
		}
		else {
			$scope.topicos = [{id:-1,titulo:"Nuevo topico"}];
			$scope.todos.topico = -1;
		}
	};
	
	$scope.actualizarEtiqueta = function(id_marcada) {
		for(var i=0; i<$scope.etiquetas.length;i++) {
			if($scope.etiquetas[i].id == $scope.contenido[id_marcada].etiqueta) {
				$scope.contenido[id_marcada].desc_etiq = $scope.etiquetas[i].descripcion;
				break;
			}
		}
	};
	$scope.addContenido = function() {
		$scope.contenido.push(
			{
				titulo:"",
				etiqueta:$scope.etiquetas[$scope.etiquetas.length-1].id,
				desc_etiq:"Debe escoger una etiqueta para subir este contenido",
				texto:""
			}
		);
	};
	$scope.delContenido = function(id_marcada) {
		ngDialog.open({
			template:'\
				<p>?Estás seguro que quieres eliminar esta vista?</p>\
				<div class="ngdialog-buttons">\
					<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button>\
					<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(1)">Sí</button>\
				</div>',
			className: 'ngdialog-theme-default',
			plain: true
		}).closePromise.then(function(data) {
			if(data.value == 1) {
				$scope.contenido.splice(id_marcada, 1);
				console.log($scope.contenido);
			}
		});
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
