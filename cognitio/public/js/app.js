//angular.module('mainApp', ['ngRoute', 'rutasApp', 'control1', 'control2', 'servicio2']);
//mainApp
var app = angular.module('mainApp', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

	// home page
	.when('/', {
		templateUrl: 'views/inicio.html',
		controller: 'controllogin'
	})
	
	.when('/registro', {
		templateUrl: 'views/registro.html',
		controller: 'controllogin'
	});

	$locationProvider.html5Mode(true);

}]);
