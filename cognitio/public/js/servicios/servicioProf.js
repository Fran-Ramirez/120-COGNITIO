angular.module('mainApp').factory('servicioProf', ['$http','$q', function($http,$q) {
	var unidad = {
		id:null,
		titulo:null
	};
	var topico = {
		id_uni:null,
		id_top:null,
		tit_uni:null,
		tit_top:null
	};
	var contenido = {
		id_uni:null,
		id_top:null,
		tit_uni:null,
		tit_top:null,
		contenido:null,
		etiquetas:null
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
		getPContenidos : function(id_sel, id_uni, papelera) {
			return $http.get('/prof_panel/filtro_papelera_con/'+id_uni+'/'+id_sel+'/'+papelera);
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
		actualizarContenido : function(datos) {
			return $http.post('/prof_panel/updateContenido', datos);
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
		moverContenidoPapelera : function(datos) {
			return $http.post('/prof_panel/a_papelera_con', datos);
		},
		unindadAtopicos : function(un, un_tit) {
			unidad.id = un;
			unidad.titulo = un_tit;
		},
		topicoDeUnidad : function() {
			return unidad;
		},
		topicoAcontenidos : function(uni_id, uni_tit, top_id, top_tit) {
			topico.id_uni = uni_id;
			topico.id_top = top_id;
			topico.tit_uni = uni_tit;
			topico.tit_top = top_tit;
		},
		contenidoDeTopico : function() {
			return topico;
		},
		contenidoAcontenido : function(uni_id,uni_tit,top_id,top_tit,con,ets) {
			contenido.id_uni = uni_id;
			contenido.id_top = top_id;
			contenido.tit_uni = uni_tit;
			contenido.tit_top = top_tit;
			contenido.contenido = con;
			contenido.etiquetas = ets;
		},
		contenidoDeContenido : function() {
			return contenido;
		},
		reordenarTopicos : function(datos) {
			return $http.post('/prof_panel/reordenarTopicos', datos);
		},
		reordenarContenidos : function(datos) {
			return $http.post('/prof_panel/reordenarContenidos', datos);
		}
	}
}]);
