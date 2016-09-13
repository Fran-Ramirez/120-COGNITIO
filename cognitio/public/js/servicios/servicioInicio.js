angular.module('mainApp').factory('servicioInicio', ['$http', function($http) {

    return {
        get : function() {
			return $http.get('/checklogin');
        },

        create : function(datos) {
            return $http.post('/signup',datos);
        },
        
        log : function(datos) {
			return $http.post('/autenticacion', datos);
		}
    }       

}]);
