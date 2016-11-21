var app = angular.module('mainApp', ['ngRoute','oc.lazyLoad','textAngular','ngDialog','ngFileUpload','ui.sortable']);
app.config(['$routeProvider', '$locationProvider', '$provide', function($routeProvider, $locationProvider, $provide) {

	$provide.decorator('taOptions',['taRegisterTool','$delegate','ngDialog', function(taRegisterTool,taOptions,ngDialog){
		taOptions.forceTextAngularSanitize = true;
		taOptions.toolbar = [
			['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
			['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
			['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
			['insertLink', 'insertVideo']
			];
		taRegisterTool('insertarImagen', {
			iconclass: "fa fa-image",
			action: function (deferred) {
				ngDialog.open({
						controller: 'subir__Imagen',
						template: 'views/prof/subida.html',
						className: 'ngdialog-theme-default'
				}).closePromise.then(function(data) {
					if(data.value == '$escape' || data.value == '$closeButton' || data.value == '$document') {
						deferred.resolve();
					}
					else {
						document.execCommand('insertImage', true, data.value);
						deferred.resolve();
					}
				});
				return false;
			}
		});
		taOptions.toolbar[3].push('insertarImagen');
		return taOptions;
	}]);

	$routeProvider

	.when('/', {
		templateUrl: 'views/auth/inicio.html',
		controller: 'controllogin'
	})

	.when('/registro', {
		templateUrl: 'views/auth/registro.html',
		controller: 'controllogin'
	})

	.when('/main', {
		templateUrl: 'views/main/main.html',
		controller: 'controlMain',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioMain.js','js/controladores/controlmain.js']});
					}]
			}
	})
	/*[INICIO]--------Paginas profesores-----------*/
	.when('/prof_login', {
		templateUrl: 'views/prof/inicio_prof.html',
		controller: 'log_prof',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioProf.js','js/controladores/control_prof.js']});
					}]
			}
	})
	.when('/main_prof', {
		templateUrl: 'views/prof/main_prof.html',
		controller: 'main_prof',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioProf.js','js/controladores/control_prof.js']});
					}]
			}
	})
	.when('/profe_subir_cont', {
		templateUrl: 'views/prof/profe_subir_cont.html',
		controller: 'subir_cont',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioProf.js','js/controladores/control_prof.js']});
					}]
			}
	})

	.when('/profe_panel', {
		templateUrl: 'views/prof/panel_contenido.html',
		controller: 'panel_cont',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioProf.js','js/controladores/control_prof.js']});
					}]
			}
	})

	.when('/profe_panel_un', {
		templateUrl: 'views/prof/panel_contenido_un.html',
		controller: 'panel_cont_un',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioProf.js','js/controladores/control_prof.js']});
					}]
			}
	})

	.when('/profe_panel_con', {
		templateUrl: 'views/prof/panel_contenido_con.html',
		controller: 'panel_cont_con',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioProf.js','js/controladores/control_prof.js']});
					}]
			}
	})

	.when('/profe_panel_con_con', {
		templateUrl: 'views/prof/panel_contenido_con_con.html',
		controller: 'panel_cont_con_con',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioProf.js','js/controladores/control_prof.js']});
					}]
			}
	})

	.when('/profe_feed', {
		templateUrl: 'views/prof/profe_feed.html',
		controller: 'main_prof',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioProf.js','js/controladores/control_prof.js']});
					}]
			}
	})
	.when('/prof_alertas', {
		templateUrl: 'views/prof/prof_alertas.html',
		controller: 'main_prof',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioProf.js','js/controladores/control_prof.js']});
					}]
			}
	})
	.when('/prof_config', {
		templateUrl: 'views/prof/prof_config.html',
		controller: 'main_prof',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioProf.js','js/controladores/control_prof.js']});
					}]
			}
	})
	/*[FIN]--------Paginas profesores-----------*/
	.when('/test', {
		templateUrl: 'views/main/test.html',
		controller: 'controlTest',
		resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioMain.js','js/controladores/controlmain.js']});
					}]
			}
	});

	$locationProvider.html5Mode(true);

}]);
