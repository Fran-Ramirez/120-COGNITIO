angular.module('mainApp').factory('servicioProf', ['$http','$q', function($http,$q) {
	var unidad = {
		id:null,
		titulo:null
	};
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
			return $http.get('/prof_panel/unidades');
		},
		getPunidades: function(papelera) {
			return $http.get('/prof_panel/filtro_papelera/'+papelera);
		},
		getPtopicos: function(id_sel,papelera) {
			return $http.get('/prof_panel/filtro_papelera_tops/'+id_sel+'/'+papelera);
		},
		cargarUnidad : function(id) {
			var d = $q.defer();
			$http.get('/prof_panel/unidad_topicos/'+id).then(function(data){
				d.resolve(data);
			});
			return d.promise;
		},
		getEtiquetas : function() {
			return $http.get('/prof_panel/etiquetas_contenido');
		},
		subirContenidos : function(datos) {
			return $http.post('/prof_panel/uploadContents', datos);
		},
		reordenarUnidades : function(datos) {
			return $http.post('/prof_panel/reordenarUnidades', datos);
		},
		actualizarUnidad : function(datos) {
			return $http.post('/prof_panel/actuUni', datos);
		},
		actualizarTopico : function(datos) {
			return $http.post('/prof_panel/actuTop', datos);
		},
		moverUnidadPapelera : function(datos) {
			return $http.post('/prof_panel/a_papelera', datos);
		},
		moverTopicoPapelera : function(datos) {
			return $http.post('/prof_panel/a_papelera_top', datos);
		},
		unindadAtopicos : function(un, un_tit) {
			unidad.id = un;
			unidad.titulo = un_tit;
		},
		topicoDeUnidad : function() {
			return unidad;
		},
		reordenarTopicos : function(datos) {
			return $http.post('/prof_panel/reordenarTopicos', datos);
		}
	}
}]);
