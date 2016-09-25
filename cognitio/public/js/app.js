var app = angular.module('mainApp', ['ngRoute','ngMaterial','ngMessages','oc.lazyLoad']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

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
		/*resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioMain.js','js/controladores/controlmain.js']});
					}]
			}*/
	})
	
	.when('/test', {
		templateUrl: 'views/main/test.html',
		controller: 'controlTest',
		/*resolve: {
				deps: ['$ocLazyLoad',function($ocLazyLoad){
						return $ocLazyLoad.load({files:['js/servicios/servicioMain.js','js/controladores/controlmain.js']});
					}]
			}*/
	});

	$locationProvider.html5Mode(true);

}]);
