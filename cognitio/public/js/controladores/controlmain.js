angular.module('mainApp').controller('controlMain',['$scope','$rootScope','$location','servicioPrincipal',function($scope,$rootScope,$location,servicioPrincipal) {
	servicioPrincipal.getTest().then(function(res) {
		if(res.data.exito == -1) {
			$location.url('/');
		}
		if(res.data.test == false) {
			$location.url('/test');
		}
	});
	servicioPrincipal.getUnidades().then(function(res) {
		if(res.data.exito == false) {
			$location.url('/');
		}
		else {
			$scope.unidades = res.data.unidades;
			$scope.uni_top = {};
			$scope.uni_top_con = {};
		}
	});
	$scope.top_activo = "";
	$scope.logout = function() {
		servicioPrincipal.logout().then(function(res) {
			if(res.data.exito == true) {
				$location.url('/');
			}
		});
	};
	$scope.cargarUnidad = function(id_uni) {
		servicioPrincipal.cargarUnidad(id_uni).then(function(res) {
			if(res.data.exito == false) {
				$location.url('/');
			}
			else {
				$scope.uni_top[id_uni] = res.data.topicos;
			}
		});
	};
	$scope.cargarContenidos = function(id_uni,id_top) {
		servicioPrincipal.cargarContenido(id_uni,id_top).then(function(res) {
			if(res.data.exito == false) {
				$location.url('/');
			}
			else {
				$scope.uni_top_con[id_uni] = {};
				$scope.uni_top_con[id_uni][id_top]=res.data.contenidos;
				for(var i=0; i<$scope.uni_top[id_uni].length;i++) {
					if($scope.uni_top[id_uni][i].id == id_top) {
						console.log($scope.uni_top[id_uni][i]);
						$scope.top_activo = $scope.uni_top[id_uni][i].titulo;
						break;
					}
				}
			}
		});
	};
}]);

angular.module('mainApp').controller('controlTest',['$scope','$rootScope','$location','servicioPrincipal',function($scope,$rootScope,$location,servicioPrincipal) {
	servicioPrincipal.getTest().then(function(res) {
		if(res.data.test == true) {
			$location.url('/main');
		}
	});
	$scope.skip = function() {
		servicioPrincipal.skiptest().then(function(res) {
			if(res.data.exito == true) {
				$location.url('/');
			}
		});
	};
	$scope.pregunta_actual = 0;
	$scope.botones = [true,false];
	$scope.tst = {"preguntas": [
			{
				"frase":"Cuando aprendo...",
				"categorias":[{"id":"EC_1","texto":"me gusta vivir sensaciones"},
							  {"id":"OR_1","texto":"me gusta pensar sobre ideas"},
							  {"id":"CA_1","texto":"me gusta estar haciendo cosas"},
							  {"id":"EA_1","texto":"me gusta observar y escuchar"}],
				"boton":true
			},
			{
				"frase":"Aprendo mejor cuando...",
				"categorias":[{"id":"EC_2","texto":"escucho y observo cuidadosamente"},
							  {"id":"OR_2","texto":"confio en el pensamiento logico"},
							  {"id":"CA_2","texto":"confio en mi intuicion y sentimientos"},
							  {"id":"EA_2","texto":"trabajo duro para hacer lograr las cosas"}],
				"boton":true
							  
			},
			{
				"frase":"Cuando estoy aprendiendo...",
				"categorias":[{"id":"EC_3","texto":"tiendo a usar el razonamiento"},
							  {"id":"OR_3","texto":"soy responsable con lo que hago"},
							  {"id":"CA_3","texto":"soy callado y reservado"},
							  {"id":"EA_3","texto":"tengo fuertes sensaciones y reacciones"}],
				"boton":true
			},
			{
				"frase":"Yo aprendo...",
				"categorias":[{"id":"EC_4","texto":"sintiendo"},
							  {"id":"OR_4","texto":"haciendo"},
							  {"id":"CA_4","texto":"observando"},
							  {"id":"EA_4","texto":"pensando"}],
				"boton":true
			},
			{
				"frase":"Cuando aprendo...",
				"categorias":[{"id":"EC_5","texto":"estoy abierto a nuevas experiencias"},
							  {"id":"OR_5","texto":"observo todos los aspectos del asunto"},
							  {"id":"CA_5","texto":"me gusta analizar las cosas, descomponerlas en sus partes"},
							  {"id":"EA_5","texto":"me gusta probar e intentar las cosas"}],
				"boton":true
			},
			{
				"frase":"Cuando estoy aprendiendo...",
				"categorias":[{"id":"EC_6","texto":"soy una persona observadora"},
							  {"id":"OR_6","texto":"soy una persona activa"},
							  {"id":"CA_6","texto":"soy una persona intuitiva"},
							  {"id":"EA_6","texto":"soy una persona logica"}],
				"boton":true
			},
			{
				"frase":"Yo aprendo mejor de...",
				"categorias":[{"id":"EC_7","texto":"la observacion"},
							  {"id":"OR_7","texto":"la relacion con otras personas"},
							  {"id":"CA_7","texto":"las teorias racionales"},
							  {"id":"EA_7","texto":"la oportunidad de probar y practicar"}],
				"boton":true
			},
			{
				"frase":"Cuando aprendo...",
				"categorias":[{"id":"EC_8","texto":"me gusta ver los resultados de mi trabajo"},
							  {"id":"OR_8","texto":"me gustan las ideas y las teorias"},
							  {"id":"CA_8","texto":"me tomo mi tiempo antes de actuar"},
							  {"id":"EA_8","texto":"me siento personalmente involucrado en las cosas"}],
				"boton":true
			},
			{
				"frase":"Aprendo mejor cuando...",
				"categorias":[{"id":"EC_9","texto":"confio en mis observaciones"},
							  {"id":"OR_9","texto":"confio en mis sentimientos"},
							  {"id":"CA_9","texto":"puedo probar por mi cuenta"},
							  {"id":"EA_9","texto":"confio en mis ideas"}],
				"boton":true
			},
			{
				"frase":"Cuando estoy aprendiendo...",
				"categorias":[{"id":"EC_10","texto":"soy una persona reservada"},
							  {"id":"OR_10","texto":"soy una persona receptiva"},
							  {"id":"CA_10","texto":"soy una persona responsable"},
							  {"id":"EA_10","texto":"soy una persona racional"}],
				"boton":true
			},
			{
				"frase":"Cuando aprendo...",
				"categorias":[{"id":"EC_11","texto":"me involucro"},
							  {"id":"OR_11","texto":"me gusta observar"},
							  {"id":"CA_11","texto":"evaluo las cosas"},
							  {"id":"EA_11","texto":"me gusta ser activo"}],
				"boton":true
			},
			{
				"frase":"Aprendo mejor cuando",
				"categorias":[{"id":"EC_12","texto":"analizo ideas"},
							  {"id":"OR_12","texto":"soy receptivo y abierto"},
							  {"id":"CA_12","texto":"soy cuidadoso"},
							  {"id":"EA_12","texto":"soy practico"}],
				"boton":true
			}
		]
	};
	$scope.visible = Array.apply(null, Array(12)).map(Boolean.prototype.valueOf,true);
	$scope.visible[0]=false;
	$scope.enviar = true;
	$scope.elem_copl = 0;
	$scope.progreso = Array.apply(null, Array(12)).map(Array.prototype.valueOf,[{"color":"red"},"X"]);
	$scope.progreso_pos = Array.apply(null, Array(12)).map(String.prototype.valueOf,"");
	$scope.progreso_pos[0]="△";
	$scope.next= function() {
		if($scope.pregunta_actual >= 11) {
			$scope.pregunta_actual = 11;
			$scope.visible.map(Boolean.prototype.valueOf,true);
			$scope.visible[11]=false;
			$scope.botones = [false,true];
		}
		else {
			$scope.visible[$scope.pregunta_actual]=true;
			$scope.progreso_pos[$scope.pregunta_actual] = "";
			$scope.visible[$scope.pregunta_actual+1]=false;
			$scope.progreso_pos[$scope.pregunta_actual+1] = "△";
			$scope.pregunta_actual++;
			if($scope.pregunta_actual!=0 && $scope.pregunta_actual!=11) {
				$scope.botones = [false,false];
			}
			else if($scope.pregunta_actual==11) {
				$scope.botones = [false,true];
			}
		}
	};
	$scope.back= function() {
		if($scope.pregunta_actual <= 0) {
			$scope.pregunta_actual = 0;
			$scope.visible.map(Boolean.prototype.valueOf,true);
			$scope.visible[0]=false;
			$scope.botones = [true,false];
		}
		else {
			$scope.visible[$scope.pregunta_actual]=true;
			$scope.progreso_pos[$scope.pregunta_actual] = "";
			$scope.visible[$scope.pregunta_actual-1]=false;
			$scope.progreso_pos[$scope.pregunta_actual-1] = "△";
			$scope.pregunta_actual--;
			if($scope.pregunta_actual!=0 && $scope.pregunta_actual!=11) {
				$scope.botones = [false,false];
			}
			else if($scope.pregunta_actual==0) {
				$scope.botones = [true,false];
			}
		}
	};
	$scope.submit = function() {
		var datos = {respuestas:$scope.preg};
		servicioPrincipal.sendTest(datos).then(function(res) {
			if(res.data.exito == true) {
				$location.url('/');
			}
		});
	};
	$scope.lock = function(i1,i2,ol) {
		if(!$scope.hasOwnProperty('preg_lock')) {
			$scope.preg_lock = [];
			$scope.preg_old = [];
		}
		if(!(i1 in $scope.preg_lock)) {
			$scope.preg_lock[i1] = [];
			$scope.preg_old[i1] = [];
			$scope.preg_old[i1][ol] = $scope.preg[i1][ol];
		}
		if(!(i2 in $scope.preg_lock[i1])) {
			$scope.preg_lock[i1][i2] = false;
		}
		$scope.preg_lock[i1][i2] = !$scope.preg_lock[i1][i2];
		if($scope.preg_old[i1][ol] != $scope.preg[i1][ol]) {
			$scope.preg_lock[i1][$scope.preg_old[i1][ol]] = false;
			$scope.preg_old[i1][ol] = $scope.preg[i1][ol];
		}
		if((1 in $scope.preg_lock[i1]) && (2 in $scope.preg_lock[i1]) && (3 in $scope.preg_lock[i1]) && (4 in $scope.preg_lock[i1])) {
			if($scope.preg_lock[i1][1] == true && $scope.preg_lock[i1][2] == true && $scope.preg_lock[i1][3] == true && $scope.preg_lock[i1][4] == true) {
				$scope.tst.preguntas[i1].boton = false;
				$scope.progreso[i1] = [{"color":"green"},"◯"];
				$scope.elem_copl++;
				if($scope.elem_copl == 12) {
					$scope.enviar = false;
				}
			}
		}
	};
	$scope.limpiar = function(i1) {
		for(x in $scope.preg[i1]) {
			$scope.preg[i1][x] = null;
		}
		for(x in $scope.preg_lock[i1]) {
			$scope.preg_lock[i1][x] = false;
		}
		for(x in $scope.preg_old[i1]) {
			$scope.preg_old[i1][x] = null;
		}
		$scope.tst.preguntas[i1].boton = true;
		$scope.progreso[i1] = [{"color":"red"},"X"];
		$scope.elem_copl--;
		$scope.enviar = true;
	};
}]);
