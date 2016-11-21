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
			$scope.contenido = {};
			$scope.unidades = [];
			$scope.topicos = [];
			$scope.etiquetas = [];
			$scope.todos = {};
			$scope.next_id = 0;
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

							$scope.contenido[$scope.next_id] = {
								titulo:"",
								etiqueta:$scope.etiquetas[$scope.etiquetas.length-1].id,
								desc_etiq:"Debe escoger una etiqueta para subir este contenido",
								texto:""
							};
							$scope.next_id++;
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
					$scope.topicos.push({id:-1,titulo:"Nuevo topico"});
					$scope.todos.topico = -1;
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
		$scope.contenido[$scope.next_id] = {
			titulo:"",
			etiqueta:$scope.etiquetas[$scope.etiquetas.length-1].id,
			desc_etiq:"Debe escoger una etiqueta para subir este contenido",
			texto:""
		};
		$scope.next_id++;
	};
	$scope.delContenido = function(id_marcada) {
		ngDialog.open({
			template:'\
				<p>¿Estás seguro que quieres eliminar esta vista?</p>\
				<div class="ngdialog-buttons">\
					<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button>\
					<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(1)">Sí</button>\
				</div>',
			className: 'ngdialog-theme-default',
			plain: true
		}).closePromise.then(function(data) {
			if(data.value == 1) {
				delete $scope.contenido[id_marcada];
			}
		});
	};
	$scope.submit = function() {
		if($scope.todos.unidad == -1) {
			ngDialog.open({
				template:'views/prof/dialog_un_to.html',
				className: 'ngdialog-theme-default'
			}).closePromise.then(function(data) {
				if(data.value != '$escape' && data.value != '$closeButton' && data.value != '$document') {
					if(data.value.unidad.titulo.length >= 1 && data.value.unidad.descripcion.length >= 1 && data.value.topico.titulo.length >= 1 && data.value.topico.descripcion.length >= 1) {
						var datos_enviar = {
							tipo:-2,
							unidad:data.value.unidad,
							topico:data.value.topico,
							contenidos:$scope.contenido
						};
						servicioProf.subirContenidos(datos_enviar).then(function(res) {
						if(res.data.exito == true) {
							ngDialog.openConfirm({
								template:'\
									<p>Los contenidos fueron subidos con éxito</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
								plain: true
							});
							$location.url('/main_prof');
						}
						else {
							ngDialog.openConfirm({
								template:'\
									<p>'+res.data.mensaje+'</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
								plain: true
							});
						}
					});
					}
				}
			});
		}
		else if($scope.todos.unidad != -1 && $scope.todos.topico == -1) {
			ngDialog.open({
				template:'views/prof/dialog_to.html',
				className: 'ngdialog-theme-default'
			}).closePromise.then(function(data) {
				if(data.value != '$escape' && data.value != '$closeButton' && data.value != '$document') {
					if(data.value.topico.titulo.length >= 1 && data.value.topico.descripcion.length >= 1) {
						var datos_enviar = {
							tipo:-1,
							unidad:$scope.todos.unidad,
							topico:data.value.topico,
							contenidos:$scope.contenido
						};
						servicioProf.subirContenidos(datos_enviar).then(function(res) {
						if(res.data.exito == true) {
							ngDialog.openConfirm({
								template:'\
									<p>Los contenidos fueron subidos con éxito</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
								plain: true
							});
							$location.url('/main_prof');
						}
						else {
							ngDialog.openConfirm({
								template:'\
									<p>'+res.data.mensaje+'</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
								plain: true
							});
						}
					});
					}
				}
			});
		}
		else {
			var tit_uni;
			var tit_top;
			for(var i=0; i<$scope.unidades.length;i++) {
				if($scope.unidades[i].id == $scope.todos.unidad) {
					tit_uni = $scope.unidades[i].titulo;
					break;
				}
			}
			for(var i=0; i<$scope.topicos.length;i++) {
				if($scope.topicos[i].id == $scope.todos.topico) {
					tit_top = $scope.topicos[i].titulo;
					break;
				}
			}
			ngDialog.open({
				template:'\
					<p>Estás a punto de subir todos estos contenidos al topico "'+tit_top+'"\
					de la unidad "'+tit_uni+'"</p>\
					<p>Al hacer click sobre \'Aceptar\' subirás todos estos contenidos a la plataforma.</p>\
					<div class="ngdialog-buttons">\
						<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Cancelar</button>\
						<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(1)">Aceptar</button>\
					</div>',
				className: 'ngdialog-theme-default',
				plain: true
			}).closePromise.then(function(data) {
				if(data.value != '$escape' && data.value != '$closeButton' && data.value != '$document') {
					var datos_enviar = {
						tipo:0,
						unidad:$scope.todos.unidad,
						topico:$scope.todos.topico,
						contenidos:$scope.contenido
					};
					servicioProf.subirContenidos(datos_enviar).then(function(res) {
						if(res.data.exito == true) {
							ngDialog.openConfirm({
								template:'\
									<p>Los contenidos fueron subidos con éxito</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
								plain: true
							});
							$location.url('/main_prof');
						}
						else {
							ngDialog.openConfirm({
								template:'\
									<p>'+res.data.mensaje+'</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
								plain: true
							});
						}
					});
				}
			});
		}
	};

}]);

angular.module('mainApp').controller('panel_cont', ['$scope', 'ngDialog', '$location', 'servicioProf', function($scope,ngDialog,$location,servicioProf) {
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
		/*[INICIO]---------------Listar unidades-------------*/
			servicioProf.getPunidades(0).then(function(res) {
				if(res.data.exito == false) {
					$location.url('/');
				}
				else {
					$scope.orden = {};
					for(var i=0;i<res.data.unidades.length;i++) {
						$scope.orden[i] = res.data.unidades[i].pos;
					}
					$scope.unidades = res.data.unidades;
				}
			});
		/*[FIN]---------------Listar unidades-------------*/
		/*[INICIO]---------------Listar papelera-------------*/
			servicioProf.getPunidades(1).then(function(res) {
				if(res.data.exito == false) {
					$location.url('/');
				}
				else {
					$scope.papelera = res.data.unidades;
				}
			});
		/*[FIN]---------------Listar papelera-------------*/
		/*[INICIO]---------------Variables-------------*/
			$scope.bit_modo = false;
		/*[FIN]---------------Variables-------------*/
		}
	});
/*[FIN]----------inicializadores ^---------------*/
	$scope.mostrarTopicos = function(id_sel, tit_id_sel) {
		servicioProf.unindadAtopicos(id_sel, tit_id_sel);
		$location.url('/profe_panel_un');
	};
	$scope.cambiarModo = function() {
		if($scope.bit_modo) {
			var datos_act = {
				nu_unidades:$scope.unidades
			};
			servicioProf.reordenarUnidades(datos_act).then(function(res) {
				if(res.data.exito == false)  {
					ngDialog.open({
						template:'<p>La nueva organización no fue guardada, intenta reordenar luego.</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
						className: 'ngdialog-theme-default',
						plain:true
					});
				}
			});
		}
		$scope.bit_modo = !$scope.bit_modo;
	};
	$scope.actualizarOrden = {
		stop: function(e, ui) {
			for (var i=0;i<$scope.unidades.length;i++) {
				$scope.unidades[i].pos = $scope.orden[i];
			}
		}
	};
	$scope.deleteUnidad = function(id_sel,modo) {
		if(modo==true) {
			var uni = [];
			var ord = {};
			for(var i=0;i<$scope.unidades.length;i++) {
				if($scope.unidades[i].id!=id_sel) {
					uni.push($scope.unidades[i]);
				}
			}
			for(var i=0;i<uni.length;i++) {
				ord[i] = uni[i].pos;
			}
			$scope.unidades = uni;
			$scope.orden = ord;
		}
		else {
			var pap = [];
			for(var i=0;i<$scope.papelera.length;i++) {
				if($scope.papelera[i].id!=id_sel) {
					pap.push($scope.papelera[i]);
				}
			}
			$scope.papelera = pap;
		}

		var botar = {
			hacia:modo,
			eliminar:id_sel
		};
		servicioProf.moverUnidadPapelera(botar).then(function(res) {
			if(res.data.exito == false) {
				ngDialog.open({
					template:'<p>La unidad no pudo ser movida a la papelera, intentalo nuevamente.</p>\
								<div class="ngdialog-buttons">\
									<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
								</div>',
					className: 'ngdialog-theme-default',
					plain:true
				});
			}
			else {
				if(modo==true) {
					servicioProf.getPunidades(1).then(function(res) {
						if(res.data.exito != false) {
							$scope.papelera = res.data.unidades;
						}
					});
				}
				else {
					servicioProf.getPunidades(0).then(function(res) {
						if(res.data.exito != false) {
							$scope.orden = {};
							for(var i=0;i<res.data.unidades.length;i++) {
								$scope.orden[i] = res.data.unidades[i].pos;
							}
							$scope.unidades = res.data.unidades;
						}
					});
				}
			}
		});
	};
	$scope.editarUnidad = function(id_sel,desc_sel,tit_sel) {
		$scope.dialogo = {};
		$scope.dialogo['e_desc_sel'] = desc_sel;
		$scope.dialogo['e_tit_sel'] = tit_sel;
		ngDialog.open({
			template:'views/prof/dialog_un.html',
			className: 'ngdialog-theme-default',
			scope:$scope
		}).closePromise.then(function(data) {
			if(data.value != '$escape' && data.value != '$closeButton' && data.value != '$document') {
				var upt_datos = {
					id:id_sel,
					titulo:data.value.unidad.titulo,
					descripcion:data.value.unidad.descripcion
				};
				if(upt_datos.titulo.length>=1 && upt_datos.descripcion.length>=1) {
					servicioProf.actualizarUnidad(upt_datos).then(function(res) {
						if(res.data.exito == false) {
							ngDialog.open({
								template:'<p>La unidad no pudo ser modificada, intentalo nuevamente.</p>\
											<div class="ngdialog-buttons">\
												<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
											</div>',
								className: 'ngdialog-theme-default',
								plain:true
							});
						}
						else {
							for(var i=0;i<$scope.unidades.length;i++) {
								if($scope.unidades[i].id == id_sel) {
									$scope.unidades[i].titulo = upt_datos.titulo;
									$scope.unidades[i].descripcion = upt_datos.descripcion;
									break;
								}
							}
						}
					});
				}
			}
		});
	};
}]);

angular.module('mainApp').controller('panel_cont_un', ['$scope', 'ngDialog', '$location', 'servicioProf', function($scope,ngDialog,$location,servicioProf) {
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
			var u_t = servicioProf.topicoDeUnidad();
			$scope.id_uni = u_t.id;
			$scope.titulo_unidad = u_t.titulo;
			if($scope.id_uni == null) {
				$location.url('/profe_panel');
			}
			else {

			/*[INICIO]---------------Listar topicos-------------*/
				servicioProf.getPtopicos($scope.id_uni,0).then(function(res) {
					if(res.data.exito == false) {
						$location.url('/');
					}
					else {
						$scope.orden = {};
						for(var i=0;i<res.data.topicos.length;i++) {
							$scope.orden[i] = res.data.topicos[i].pos;
						}
						$scope.topicos = res.data.topicos;
					}
				});
			/*[FIN]---------------Listar unidades-------------*/
			/*[INICIO]---------------Listar papelera-------------*/
				servicioProf.getPtopicos($scope.id_uni,1).then(function(res) {
					if(res.data.exito == false) {
						$location.url('/');
					}
					else {
						$scope.papelera = res.data.topicos;
					}
				});
			/*[FIN]---------------Listar papelera-------------*/
			/*[INICIO]---------------Variables-------------*/
				$scope.bit_modo = false;
			/*[FIN]---------------Variables-------------*/
			}
		}
	});
/*[FIN]----------inicializadores ^---------------*/
	$scope.cambiarModo = function() {
		if($scope.bit_modo) {
			var datos_act = {
				nu_id_uni:$scope.id_uni,
				nu_topicos:$scope.topicos
			};
			servicioProf.reordenarTopicos(datos_act).then(function(res) {
				if(res.data.exito == false)  {
					ngDialog.open({
						template:'<p>La nueva organización no fue guardada, intenta reordenar luego.</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
						className: 'ngdialog-theme-default',
						plain:true
					});
				}
			});
		}
		$scope.bit_modo = !$scope.bit_modo;
	};
	$scope.mostrarContenidos = function(id_sel,desc_sel) {
		servicioProf.topicoAcontenidos($scope.id_uni, $scope.titulo_unidad, id_sel, desc_sel);
		$location.url('/profe_panel_con');
	};
	$scope.editarTopico = function(id_sel,desc_sel,tit_sel) {
		$scope.dialogo = {};
		$scope.dialogo['e_desc_sel'] = desc_sel;
		$scope.dialogo['e_tit_sel'] = tit_sel;
		ngDialog.open({
			template:'views/prof/dialog_to2.html',
			className: 'ngdialog-theme-default',
			scope:$scope
		}).closePromise.then(function(data) {
			if(data.value != '$escape' && data.value != '$closeButton' && data.value != '$document') {
				var upt_datos = {
					id:id_sel,
					id_id_uni:$scope.id_uni,
					titulo:data.value.topico.titulo,
					descripcion:data.value.topico.descripcion
				};
				if(upt_datos.titulo.length>=1 && upt_datos.descripcion.length>=1) {
					servicioProf.actualizarTopico(upt_datos).then(function(res) {
						if(res.data.exito == false) {
							ngDialog.open({
								template:'<p>El tópico no pudo ser modificado, intentalo nuevamente.</p>\
											<div class="ngdialog-buttons">\
												<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
											</div>',
								className: 'ngdialog-theme-default',
								plain:true
							});
						}
						else {
							for(var i=0;i<$scope.topicos.length;i++) {
								if($scope.topicos[i].id == id_sel) {
									$scope.topicos[i].titulo = upt_datos.titulo;
									$scope.topicos[i].descripcion = upt_datos.descripcion;
									break;
								}
							}
						}
					});
				}
			}
		});
	};
	$scope.deleteTopico = function(modo, id_sel) {
		if(modo) {
			var top = [];
			var ord = {};
			for(var i=0;i<$scope.topicos.length;i++) {
				if($scope.topicos[i].id!=id_sel) {
					top.push($scope.topicos[i]);
				}
			}
			for(var i=0;i<top.length;i++) {
				ord[i] = top[i].pos;
			}
			$scope.topicos = top;
			$scope.orden = ord;
		}
		else {
			var pap = [];
			for(var i=0;i<$scope.papelera.length;i++) {
				if($scope.papelera[i].id!=id_sel) {
					pap.push($scope.papelera[i]);
				}
			}
			$scope.papelera = pap;
		}
		var botar = {
			hacia:modo,
			eliminar_uni:$scope.id_uni,
			eliminar_top:id_sel
		};
		servicioProf.moverTopicoPapelera(botar).then(function(res) {
			if(res.data.exito == false) {
				ngDialog.open({
					template:'<p>El tópico no pudo ser movido a la papelera, intentalo nuevamente.</p>\
								<div class="ngdialog-buttons">\
									<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
								</div>',
					className: 'ngdialog-theme-default',
					plain:true
				});
			}
			else {
				if(modo) {
					servicioProf.getPtopicos($scope.id_uni,1).then(function(res) {
						if(res.data.exito != false) {
							$scope.papelera = res.data.topicos;
						}
					});
				}
				else {
					servicioProf.getPtopicos($scope.id_uni,0).then(function(res) {
						if(res.data.exito != false)  {
							$scope.orden = {};
							for(var i=0;i<res.data.topicos.length;i++) {
								$scope.orden[i] = res.data.topicos[i].pos;
							}
							$scope.topicos = res.data.topicos;
						}
					});
				}
			}
		});
	};
	$scope.actualizarOrden = {
		stop: function(e, ui) {
			for (var i=0;i<$scope.topicos.length;i++) {
				$scope.topicos[i].pos = $scope.orden[i];
			}
		}
	};
}]);

angular.module('mainApp').controller('panel_cont_con', ['$scope', 'ngDialog', '$location', 'servicioProf', function($scope,ngDialog,$location,servicioProf) {
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
			var u_t_t = servicioProf.contenidoDeTopico();
			if(u_t_t.tit_uni == null || u_t_t.tit_top == null || u_t_t.id_uni == null || u_t_t.id_top == null) {
				$location.url('/profe_panel');
			}
			else {
				$scope.titulo_unidad = u_t_t.tit_uni;
				$scope.titulo_topico = u_t_t.tit_top;
				$scope.id_unidad = u_t_t.id_uni;
				$scope.id_topico = u_t_t.id_top;
				$scope.bit_modo = false;
				servicioProf.getPContenidos($scope.id_topico, 	$scope.id_unidad, 0).then(function(res) {
					if(res.data.exito == false) {
						servicioProf.unindadAtopicos($scope.id_unidad, $scope.titulo_unidad);
						$location.url('/profe_panel_un');
					}
					else {
						$scope.etiquetas = {};
						for(var i=0;i<res.data.cosas.etiquetas.length;i++) {
							$scope.etiquetas[res.data.cosas.etiquetas[i].id] = {
								nombre_etiqueta:res.data.cosas.etiquetas[i].nombre_etiqueta,
								descripcion:res.data.cosas.etiquetas[i].descripcion
							};
						}
						$scope.contenidos = res.data.cosas.contenidos;
						$scope.orden = {};
						for(var i=0; i<res.data.cosas.contenidos.length; i++) {
							$scope.orden[i] = res.data.cosas.contenidos[i].pos;

						}
					}
				});
				servicioProf.getPContenidos($scope.id_topico, 	$scope.id_unidad, 1).then(function(res) {
					if(res.data.exito == false) {
						servicioProf.unindadAtopicos($scope.id_unidad, $scope.titulo_unidad);
						$location.url('/profe_panel_un');
					}
					else {
						$scope.papelera = res.data.cosas.contenidos;
					}
				});
			}
		}
	});
/*[FIN] inicializadores*/
	$scope.cambiarModo = function() {
		if($scope.bit_modo) {
			var datos_act = {
				nu_id_uni:$scope.id_unidad,
				nu_id_top:$scope.id_topico,
				nu_contenidos:$scope.contenidos
			};
			servicioProf.reordenarContenidos(datos_act).then(function(res) {
				if(res.data.exito == false)  {
					ngDialog.open({
						template:'<p>La nueva organización no fue guardada, intenta reordenar luego.</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
						className: 'ngdialog-theme-default',
						plain:true
					});
				}
			});
		}
		$scope.bit_modo = !$scope.bit_modo;
	};
	$scope.volverTopico = function() {
		servicioProf.unindadAtopicos($scope.id_unidad, $scope.titulo_unidad);
		$location.url('/profe_panel_un');
	};
	$scope.actualizarOrden = {
		stop: function(e, ui) {
			for (var i=0;i<$scope.contenidos.length;i++) {
				$scope.contenidos[i].pos = $scope.orden[i];
			}
		}
	};
	$scope.actualizarContenido=function(sel) {
		servicioProf.contenidoAcontenido($scope.id_unidad,$scope.titulo_unidad,$scope.id_topico,$scope.titulo_topico,sel,$scope.etiquetas);
		$location.url('/profe_panel_con_con');
	};
	$scope.deleteContenido = function(modo, id_sel) {
		if(modo) {
			var con = [];
			var ord = {};
			for(var i=0;i<$scope.contenidos.length;i++) {
				if($scope.contenidos[i].id!=id_sel) {
					con.push($scope.contenidos[i]);
				}
			}
			for(var i=0;i<con.length;i++) {
				ord[i] = con[i].pos;
			}
			$scope.contenidos = con;
			$scope.orden = ord;
		}
		else {
			var pap = [];
			for(var i=0;i<$scope.papelera.length;i++) {
				if($scope.papelera[i].id!=id_sel) {
					pap.push($scope.papelera[i]);
				}
			}
			$scope.papelera = pap;
		}
		var botar = {
			hacia:modo,
			eliminar_uni:$scope.id_unidad,
			eliminar_top:$scope.id_topico,
			eliminar_con:id_sel
		};
		servicioProf.moverContenidoPapelera(botar).then(function(res) {
			if(res.data.exito == false) {
				ngDialog.open({
					template:'<p>El tópico no pudo ser movido hacia o desde la papelera, intentalo nuevamente.</p>\
								<div class="ngdialog-buttons">\
									<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
								</div>',
					className: 'ngdialog-theme-default',
					plain:true
				});
			}
			else {
				if(modo) {
					servicioProf.getPContenidos($scope.id_topico, 	$scope.id_unidad, 1).then(function(res) {
						if(res.data.exito != false) {
							$scope.papelera = res.data.cosas.contenidos;
						}
					});
				}
				else {
					servicioProf.getPContenidos($scope.id_topico, 	$scope.id_unidad, 0).then(function(res) {
						if(res.data.exito != false) {
							$scope.etiquetas = {};
							for(var i=0;i<res.data.cosas.etiquetas.length;i++) {
								$scope.etiquetas[res.data.cosas.etiquetas[i].id] = {
									nombre_etiqueta:res.data.cosas.etiquetas[i].nombre_etiqueta,
									descripcion:res.data.cosas.etiquetas[i].descripcion
								};
							}
							$scope.contenidos = res.data.cosas.contenidos;
							$scope.orden = {};
							for(var i=0; i<res.data.cosas.contenidos.length; i++) {
								$scope.orden[i] = res.data.cosas.contenidos[i].pos;
							}
						}
					});
				}
			}
		});
	};
}]);

angular.module('mainApp').controller('panel_cont_con_con', ['$scope', 'ngDialog', '$location', 'servicioProf', function($scope,ngDialog,$location,servicioProf) {
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
			var u_t_c_c = servicioProf.contenidoDeContenido();
			if(u_t_c_c.id_uni==null || u_t_c_c.id_top==null || u_t_c_c.tit_uni==null || u_t_c_c.tit_top==null || u_t_c_c.contenido==null || u_t_c_c.etiquetas==null) {
				$location.url('/profe_panel');
			}
			else {
				$scope.titulo_unidad = u_t_c_c.tit_uni;
				$scope.titulo_topico = u_t_c_c.tit_top;
				$scope.id_unidad = u_t_c_c.id_uni;
				$scope.id_topico = u_t_c_c.id_top;
				$scope.contenido = u_t_c_c.contenido;
				$scope.indiceEtiquetas = u_t_c_c.etiquetas;
				$scope.id_contenido = u_t_c_c.contenido.id;
				$scope.posicion_ori = u_t_c_c.contenido.pos;
				var ids_ets = Object.keys(u_t_c_c.etiquetas);
				var ets_f = [];
				console.log(u_t_c_c.etiquetas);
				console.log(ids_ets);
				for(var i=0; i<ids_ets.length;i++) {
					var k =ids_ets[i];
					u_t_c_c.etiquetas[k]['id'] = parseInt(k);
					ets_f.push(u_t_c_c.etiquetas[k]);
				}
				$scope.etiquetas = ets_f;
				servicioProf.getPunidades(0).then(function(res){
					if(res.data.exito==false) {
						$location.url('/');
					}
					else {
						$scope.nuevo = {};
						$scope.unidades = res.data.unidades;
						$scope.unidades.push({id:-1,titulo:"Nueva unidad"});
						$scope.nuevo['unidad'] = $scope.id_unidad;
						servicioProf.cargarUnidad($scope.nuevo.unidad).then(function(res){
							if(res.data.exito!=true) {
								$location.url('/');
							}
							else {
								$scope.topicos = res.data.topicos;
								$scope.topicos.push({id:-1,titulo:"Nuevo topico"});
								$scope.nuevo.topico = $scope.id_topico;
								$scope.nuevo.etiqueta = $scope.contenido.etiqueta_id;
								$scope.nuevo.desc_eti = u_t_c_c.etiquetas[$scope.contenido.etiqueta_id].descripcion;
								$scope.nuevo.titulo = $scope.contenido.titulo;
								$scope.nuevo.info = $scope.contenido.info;
								console.log($scope.etiquetas);
							}
						});
					}
				});

			}
		}
	});

	$scope.actualizarEtiqueta = function() {
		$scope.nuevo.desc_eti = $scope.indiceEtiquetas[$scope.nuevo.etiqueta].descripcion;
	};
	$scope.actualizarTopicos = function() {
		if($scope.nuevo.unidad != -1) {
			servicioProf.cargarUnidad($scope.nuevo.unidad).then(function(res){
				if(res.data.exito==true) {
					$scope.topicos = res.data.topicos;
					$scope.topicos.push({id:-1,titulo:"Nuevo topico"});
					$scope.nuevo.topico = -1;
				}
			});
		}
		else {
			$scope.topicos = [{id:-1,titulo:"Nuevo topico"}];
			$scope.nuevo.topico = -1;
		}
	};
	$scope.volverTopico = function() {
		servicioProf.unindadAtopicos($scope.id_unidad, $scope.titulo_unidad);
		$location.url('/profe_panel_un');
	};
	$scope.volverContenido = function() {
		servicioProf.contenidoAcontenido($scope.id_unidad, $scope.titulo_unidad,$scope.id_topico,$scope.titulo_topico,$scope.contenido,$scope.indiceEtiquetas);
		$location.url('/profe_panel_con');
	};
	$scope.submit = function() {
		if($scope.nuevo.unidad == -1) {
			ngDialog.open({
				template:'views/prof/dialog_un_to.html',
				className: 'ngdialog-theme-default'
			}).closePromise.then(function(data) {
				if(data.value != '$escape' && data.value != '$closeButton' && data.value != '$document') {
					if(data.value.unidad.titulo.length >= 1 && data.value.unidad.descripcion.length >= 1 && data.value.topico.titulo.length >= 1 && data.value.topico.descripcion.length >= 1) {
						var datos_enviar = {
							tipo:-2,
							unidad:data.value.unidad,
							topico:data.value.topico,
							titulo:$scope.nuevo.titulo,
							info:$scope.nuevo.info,
							etiqueta:$scope.nuevo.etiqueta,
							v_unidad:$scope.id_unidad,
							v_topico:$scope.id_topico,
							v_con:$scope.id_contenido,
							pos:$scope.posicion_ori
						};
						servicioProf.actualizarContenido(datos_enviar).then(function(res) {
							if(res.data.exito == true) {
								ngDialog.openConfirm({
									template:'\
										<p>El contenido fue actualizado con éxito</p>\
										<div class="ngdialog-buttons">\
											<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
										</div>',
									plain: true
								});
								servicioProf.topicoAcontenidos($scope.id_unidad, $scope.titulo_unidad, $scope.id_topico, $scope.titulo_topico);
								$location.url('/profe_panel_con');
							}
							else {
								ngDialog.openConfirm({
									template:'\
										<p>'+res.data.mensaje+'</p>\
										<div class="ngdialog-buttons">\
											<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
										</div>',
									plain: true
								});
							}
						});
					}
				}
			});
		}
		else if($scope.nuevo.unidad != -1 && $scope.nuevo.topico == -1) {
			ngDialog.open({
				template:'views/prof/dialog_to.html',
				className: 'ngdialog-theme-default'
			}).closePromise.then(function(data) {
				if(data.value != '$escape' && data.value != '$closeButton' && data.value != '$document') {
					if(data.value.topico.titulo.length >= 1 && data.value.topico.descripcion.length >= 1) {
						var datos_enviar = {
							tipo:-1,
							unidad:$scope.nuevo.unidad,
							topico:data.value.topico,
							titulo:$scope.nuevo.titulo,
							info:$scope.nuevo.info,
							etiqueta:$scope.nuevo.etiqueta,
							v_unidad:$scope.id_unidad,
							v_topico:$scope.id_topico,
							v_con:$scope.id_contenido,
							pos:$scope.posicion_ori
						};
						servicioProf.actualizarContenido(datos_enviar).then(function(res) {
						if(res.data.exito == true) {
							ngDialog.openConfirm({
								template:'\
									<p>El contenido fue actualizado y trasladado de tópico éxito</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
								plain: true
							});
							servicioProf.topicoAcontenidos($scope.id_unidad, $scope.titulo_unidad, $scope.id_topico, $scope.titulo_topico);
							$location.url('/profe_panel_con');
						}
						else {
							ngDialog.openConfirm({
								template:'\
									<p>'+res.data.mensaje+'</p>\
									<div class="ngdialog-buttons">\
										<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
									</div>',
								plain: true
							});
						}
					});
					}
				}
			});
		}
		else {
			var tit_uni;
			var tit_top;
			for(var i=0; i<$scope.unidades.length;i++) {
				if($scope.unidades[i].id == $scope.nuevo.unidad) {
					tit_uni = $scope.unidades[i].titulo;
					break;
				}
			}
			for(var i=0; i<$scope.topicos.length;i++) {
				if($scope.topicos[i].id == $scope.nuevo.topico) {
					tit_top = $scope.topicos[i].titulo;
					break;
				}
			}
			var datos_enviar = {
				tipo:0,
				unidad:$scope.nuevo.unidad,
				topico:$scope.nuevo.topico,
				titulo:$scope.nuevo.titulo,
				info:$scope.nuevo.info,
				etiqueta:$scope.nuevo.etiqueta,
				v_unidad:$scope.id_unidad,
				v_topico:$scope.id_topico,
				v_con:$scope.id_contenido,
				pos:$scope.posicion_ori
			};
			servicioProf.actualizarContenido(datos_enviar).then(function(res) {
				if(res.data.exito == true) {
					ngDialog.openConfirm({
						template:'\
							<p>El contenido fue actualizado y trasladado con éxito</p>\
							<div class="ngdialog-buttons">\
								<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
							</div>',
						plain: true
					});
					servicioProf.topicoAcontenidos($scope.id_unidad, $scope.titulo_unidad, $scope.id_topico, $scope.titulo_topico);
					$location.url('/profe_panel_con');
				}
				else {
					ngDialog.openConfirm({
						template:'\
							<p>'+res.data.mensaje+'</p>\
							<div class="ngdialog-buttons">\
								<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Ok</button>\
							</div>',
						plain: true
					});
				}
			});
		}
	};
}]);

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
