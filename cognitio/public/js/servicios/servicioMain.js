angular.module('mainApp').factory('servicioPrincipal', ['$http', function($http) {

    return {
        getTest : function() {
			return $http.get('/main/checktest');
        },
        sendTest : function(datos) {
			return $http.post('/main/respondertest',datos);
		}
    }       

}]);
