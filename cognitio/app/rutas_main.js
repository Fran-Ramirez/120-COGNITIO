var app = require('express').Router();

app.get('/unidades', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var unidades = require('./modelos/contenidos1');
		unidades.lista_unidades(function(err,uns) {
			if(err) {
				res.json({exito:false});
			}
			else {
				res.json({exito:true,unidades:uns});
			}
		});
	}
	else {
		res.json({exito:false});
	}
});

app.get('/unidad_topicos/:uni',function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var unidades = require('./modelos/contenidos1');
		unidades.lista_unidad_topico(req.params.uni, function(err,tops) {
			if(err) {
				res.json({exito:false});
			}
			else {
				res.json({exito:true,topicos:tops});
			}
		});
	}
	else {
		res.json({exito:false});
	}
});

app.get('/unidad_top_con/:uni/:top',function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var unidades = require('./modelos/contenidos1');
		var desencriptar = require('./modelos/usuario').desencriptar;
		unidades.lista_un_to_co(desencriptar(sess.correo), req.params.uni, req.params.top, function(err,con) {
			if(err) {
				res.json({exito:false});
			}
			else {
				res.json({exito:true,contenidos:con});
			}
		});
	}
	else {
		res.json({exito:false});
	}
});

app.get('/checktest', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var usuario = require('./modelos/usuario');
		var pass = usuario.desencriptar(sess.passwd);
		var correo = usuario.desencriptar(sess.correo);
		var perfil = sess.skip;
		usuario.getTest(correo,pass,function(err, b_test) {
			if(err || b_test == null) {
				res.json({exito:-1});
			}
			else {
				if(b_test == false && perfil != true) {
					res.json({test:false});
				}
				else {
					res.json({test:true});
				}
			}
		});
	}
	else {
		res.json({exito:-1});
	}
});

app.get('/skiptest', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		sess.skip = true;
		res.json({exito:true});
	}
	else {
		res.json({exito:-1});
	}
});

app.post('/respondertest', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		if(!req.body.respuestas) {
			res.json({exito:false});
		}
		else {
			var pregs = req.body.respuestas;
			var count = Object.keys(pregs).length;
			if(count != 12) {
				res.json({exito:false});
			}
			else {
				var count2, datos;
				for(elemento in pregs) {
					count2 = Object.keys(pregs[elemento]).length;
					datos = Object.keys(pregs[elemento]).map(function(key){return pregs[elemento][key]});
					if(count2!=4 || datos.indexOf(null)!==-1) {
						break;
					}
				}
				if(count2!=4 || datos.indexOf(null)!==-1) {
					res.json({exito:false});
				}
				else {
					var EC = 0;
					var OR = 0;
					var CA = 0;
					var EA = 0;
					for(var fila=0;fila<12;fila++) {
						EC += pregs[fila][0];
						OR += pregs[fila][1];
						CA += pregs[fila][2];
						EA += pregs[fila][3];
					}
					var x = EA-OR;
					var y = CA-EC;
					var usuario = require('./modelos/usuario');
					var pass = usuario.desencriptar(sess.passwd);
					var correo = usuario.desencriptar(sess.correo);
					var tipo_perfil;
					if(y<=3) {
						if(x>=6) {
							tipo_perfil = 1; //adaptador
						}
						else {
							tipo_perfil = 4; //divergente
						}
					}
					else {
						if(x>=6) {
							tipo_perfil = 3; //convergente
						}
						else {
							tipo_perfil = 2; //asimilador
						}
					}
					usuario.setTest(correo,pass,tipo_perfil,function(err, ok) {
						if(err) {
							res.json({exito:false});
						}
						else {
							if(ok == false) {
								res.json({exito:false});
							}
							else {
								res.json({exito:true});
							}
						}
					});
				}
			}
		}
	}
	else {
		res.json({exito:false});
	}
});

module.exports = app;
