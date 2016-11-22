angular.module('mainApp').factory('servicioPrincipal', ['$http','$q', function($http,$q) {

    return {
        getTest : function() {
			return $http.get('/main/checktest');
        },
        sendTest : function(datos) {
			return $http.post('/main/respondertest',datos);
		},
		skiptest : function() {
			return $http.get('/main/skiptest');
		},
		logout : function() {
			return $http.get('/log/logout');
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
		cargarContenido : function(id_u, id_t) {
			var d = $q.defer();
			$http.get('/main/unidad_top_con/'+id_u+'/'+id_t).then(function(data){
				d.resolve(data);
			});
			return d.promise;
		},
    enviarFeedback : function(datos) {
      return $http.post('/main/enviarFeed',datos);
    }

    }

}]);
