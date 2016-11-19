angular.module('mainApp').factory('servicioProf', ['$http','$q', function($http,$q) {
    return {
		getProf : function() {
			return $http.get('/prof/checklogin');
		},
		
		logProf : function(datos) {
			return $http.post('/prof/autenticacion', datos);
		},
		
		getTipo : function() {
			return $http.get('/prof_panel/tipo_profe');
		},
		
		logout : function() {
			return $http.get('/prof/logout');
		},
		
		getUnidades : function() {
			return $http.get('/main/unidades');
		},
		cargarUnidad : function(id) {
			var d = $q.defer();
			$http.get('/main/unidad_topicos/'+id).then(function(data){
				d.resolve(data);
			});
			return d.promise;
		},
		getEtiquetas : function() {
			return $http.get('/prof_panel/etiquetas_contenido');
		},
		subirContenidos : function(datos) {
			return $http.post('/prof_panel/uploadContents', datos);
		}
	}
}]);
