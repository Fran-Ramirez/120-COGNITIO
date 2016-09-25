angular.module('mainApp').factory('servicioInicio', ['$http', function($http) {

    return {
        get : function() {
			return $http.get('/log/checklogin');
        },

        create : function(datos) {
            return $http.post('/log/signup',datos);
        },
        
        log : function(datos) {
			return $http.post('/log/autenticacion', datos);
		}
    }       

}]);
