var app = require('express').Router();

app.get('/profe_profiles_estudiantes', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var usuarios = require('./modelos/usuario');
		usuarios.obtener_usuarios(function(err, succ) {
			if(err) {
				res.json({exito:false});
			}
			else if(err==null && succ!=null) {
				res.json({exito:true,usuarios:succ});
			}
		});
	}
	else {
		return res.json({exito:false});
	}
});

app.get('/profe_profiles_profesores', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var usuarios = require('./modelos/usuario');
		usuarios.obtener_profesores(function(err, succ) {
			if(err == null && succ == null) {
				res.json({exito:false});
			}
			else if(err==null && succ!=null){
				res.json({exito:true,profesores:succ});
			}
		});
	}
	else {
		return res.json({exito:false});
	}
});

app.get('/tipo_profe', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			var usuario = require('./modelos/panel_profe');
			var user = desencriptar(sess.correo);
			var pass = desencriptar(sess.passwd);
			usuario.tipo_profe(user,pass,function(error,succ) {
				if(error==null) {
					if(succ == null) {
						return res.json({exito:false});
					}
					else if(succ==true) {
						return res.json({exito:true,tipo:1,extras:[
								{txt:"Añadir Cuenta",fnc:"/profe_add_cuenta"},
								{txt:"Perfiles",fnc:"/profe_prof"},
								{txt:"Modificar etiquetas",fnc:"/prof_etiqueta"}
							]});
					}
					else {
						return res.json({exito:true,tipo:0});
					}
				}
			});
		}
		else if(desencriptar(sess.extra)=='@alumnos.usm.cl' || desencriptar(sess.extra)=='@sansano.usm.cl') {
			return res.json({exito:false});
		}
	}
	else {
		return res.json({exito:false});
	}
});

app.get('/etiquetas_contenido', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var unidades = require('./modelos/contenidos1');
		unidades.etiquetas(function(err,ets) {
			if(err) {
				res.json({exito:false});
			}
			else {
				res.json({exito:true,etiquetas:ets});
			}
		});
	}
	else {
		res.json({exito:false});
	}
});

app.get('/getFeedback', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var usuario = require('./modelos/panel_profe');
		usuario.devolverFeedback(function(err,ets) {
			if(err) {
				res.json({exito:false});
			}
			else {
				res.json({exito:true,feed:ets});
			}
		});
	}
	else {
		res.json({exito:false});
	}
});

app.get('/relacionesEtiqueta/:et', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var usuario = require('./modelos/panel_profe');
		usuario.perfilEtiqueta(req.params.et,function(resultado) {
			if(resultado === null) {
				res.json({exito:false});
			}
			else {
				res.json({exito:true,conexiones:resultado});
			}
		});
	}
	else {
		res.json({exito:false});
	}
});

app.get('/dataFeedback/:uni/:top/:con', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var usuario = require('./modelos/panel_profe');
		usuario.dataFeedback(req.params.uni,req.params.top,req.params.con, function(ets) {
			if(ets===false) {
				res.json({exito:false});
			}
			else {
				console.log(ets);
				res.json({exito:true,con:ets});
			}
		});
	}
	else {
		res.json({exito:false});
	}
});

app.post('/subir_foto_contenido',function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		uploadFoto(req,res,function(err){
			if(err) {
				res.json({exito:false});
			}
			else {
				res.json({exito:true,img:'imagenes/subidas/'+req.file.filename});
			}
		});
	}
	else {
		res.json({exito:false});
	}
});

app.post('/updateEtiqueta',function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		if(!(req.body.etiqueta==null || req.body.titulo == null || req.body.descripcion == null ||
		   req.body.adaptador == null  || req.body.asimilador == null  || req.body.convergente == null ||
		 	 req.body.divergente == null)) {
			var usuario = require('./modelos/panel_profe');
			usuario.actualizarEtiqueta(req.body.etiqueta,req.body.titulo,req.body.descripcion,req.body.adaptador,req.body.asimilador,req.body.convergente,req.body.divergente,function(err){
				if(!err) {
					res.json({exito:false});
				}
				else {
					res.json({exito:true});
				}
			});
		}
	}
	else {
		res.json({exito:false});
	}
});

app.post('/addEtiqueta',function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		if(!(req.body.titulo==null || req.body.descripcion==null)) {
			var usuario = require('./modelos/panel_profe');
			usuario.aniadirEtiqueta(req.body.titulo, req.body.descripcion, function(err){
				if(!err) {
					res.json({exito:false});
				}
				else {
					res.json({exito:true});
				}
			});
		}
	}
	else {
		res.json({exito:false});
	}
});

app.post('/suspenderProfe',function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		if(!(req.body.id==null || req.body.funcion==null)) {
			var usuario = require('./modelos/panel_profe');
			usuario.banProfe(req.body.id, req.body.funcion, function(err){
				if(!err) {
					res.json({exito:false});
				}
				else {
					res.json({exito:true});
				}
			});
		}
	}
	else {
		res.json({exito:false});
	}
});

app.post('/suspenderEstudiante',function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		if(!(req.body.rol==null || req.body.funcion==null)) {
			var usuario = require('./modelos/panel_profe');
			usuario.banEstudiante(req.body.rol, req.body.funcion, function(err){
				if(!err) {
					res.json({exito:false});
				}
				else {
					res.json({exito:true});
				}
			});
		}
	}
	else {
		res.json({exito:false});
	}
});

app.post('/aniadirCta',function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		if(!(req.body.email==null || req.body.nombre == null || req.body.apellido1 == null ||
		   req.body.apellido2 == null  || req.body.pass == null  || req.body.tipo == null)) {
			var usuario = require('./modelos/panel_profe');
			usuario.registrarUsuario(req.body.email,req.body.nombre,req.body.apellido1,req.body.apellido2,req.body.pass,req.body.tipo,function(err){
				if(!err) {
					res.json({exito:false});
				}
				else {
					res.json({exito:true});
				}
			});
		}
	}
	else {
		res.json({exito:false});
	}
});

app.post('/updateContenido', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;

		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.tipo==null || req.body.unidad==null || req.body.topico==null || req.body.titulo == null ||
				req.body.info == null || req.body.etiqueta == null || req.body.v_unidad == null ||
				req.body.v_topico == null || req.body.v_con == null || req.body.pos == null) {
				return res.json({exito:false,mensaje:'Algo salió mal'});

			}
			else {
				if(req.body.etiqueta == -1) {
					return res.json({exito:false,mensaje:'La etiqueta no existe.'});
				}
				if(req.body.pos < 1) {
					return res.json({exito:false,mensaje:'La posición no existe.'});
				}
				if(req.body.info.length == 0) {
					return res.json({exito:false,mensaje:'El contenido debe tener algo escrito.'});
				}
				if(req.body.titulo.length == 0) {
					return res.json({exito:false,mensaje:'El contenido no tiene titulo.'});
				}
				var usuario = require('./modelos/panel_profe');
				usuario.actualizar_contenido(req.body.tipo,req.body.unidad,req.body.topico,req.body.titulo,req.body.info,req.body.etiqueta,req.body.v_unidad,req.body.v_topico,req.body.v_con,req.body.pos,function(c) {
					if(c==false) {
						return res.json({exito:false,mensaje:'Algo salió mal'});
					}
					else {
						return res.json({exito:true});
					}
				});
			}
		}
	}
	else {

		res.json({exito:false,mensaje:'Algo salió mal'});
	}
});
app.post('/uploadContents', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.tipo==null || req.body.unidad==null || req.body.topico==null || req.body.contenidos == null) {
				return res.json({exito:false,mensaje:'Algo salió mal'});
			}
			else {
				for(var llave in req.body.contenidos) {
					if(req.body.contenidos[llave].etiqueta == -1) {
						return res.json({exito:false,mensaje:'Uno de los contenidos no tiene etiqueta.'});
					}
					else if(req.body.contenidos[llave].texto.length == 0) {
						return res.json({exito:false,mensaje:'Uno de los contenidos no tiene nada.'});
					}
				}
				var usuario = require('./modelos/panel_profe');
				usuario.subir_contenido(req.body.tipo,req.body.unidad,req.body.topico,req.body.contenidos,function(c) {
					if(c==false) {
						return res.json({exito:false,mensaje:'Algo salió mal'});
					}
					else {
						return res.json({exito:true});
					}
				});
			}
		}
	}
	else {
		res.json({exito:false,mensaje:'Algo salió mal'});
	}
});

app.post('/actuUni', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.id==null || req.body.titulo==null || req.body.descripcion==null) {
				return res.json({exito:false,mensaje:'Algo salió mal'});
			}
			else {

				if(req.body.titulo.length < 1) {
					return res.json({exito:false});
				}
				if(req.body.descripcion.length < 1) {
					return res.json({exito:false});
				}
				var usuario = require('./modelos/panel_profe');
				usuario.actualizarUnidad(req.body.id,req.body.titulo,req.body.descripcion,function(c) {
					if(c==false) {
						return res.json({exito:false,mensaje:'Algo salió mal'});
					}
					else {
						return res.json({exito:true});
					}
				});
			}
		}
	}
	else {
		res.json({exito:false,mensaje:'Algo salió mal'});
	}
});

app.post('/actuTop', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.id==null || req.body.id_id_uni==null || req.body.titulo==null || req.body.descripcion==null) {
				return res.json({exito:false,mensaje:'Algo salió mal'});
			}
			else {

				if(req.body.titulo.length < 1) {
					return res.json({exito:false});
				}
				if(req.body.descripcion.length < 1) {
					return res.json({exito:false});
				}
				var usuario = require('./modelos/panel_profe');
				usuario.actualizarTopico(req.body.id,req.body.id_id_uni,req.body.titulo,req.body.descripcion,function(c) {
					if(c==false) {
						return res.json({exito:false,mensaje:'Algo salió mal'});
					}
					else {
						return res.json({exito:true});
					}
				});
			}
		}
	}
	else {
		res.json({exito:false,mensaje:'Algo salió mal'});
	}
});

app.post('/a_papelera', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.eliminar==null || req.body.hacia==null) {
				return res.json({exito:false,mensaje:'Algo salió mal'});
			}
			else {

				if(req.body.eliminar < 1) {
					return res.json({exito:false});
				}
				var usuario = require('./modelos/panel_profe');
				usuario.tirarPapelera(req.body.hacia,req.body.eliminar,function(c) {
					if(c==false) {
						return res.json({exito:false,mensaje:'Algo salió mal'});
					}
					else {
						return res.json({exito:true});
					}
				});
			}
		}
	}
	else {
		res.json({exito:false,mensaje:'Algo salió mal'});
	}
});

app.post('/a_papelera_top', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.eliminar_uni==null || req.body.eliminar_top==null || req.body.hacia==null) {
				return res.json({exito:false,mensaje:'Algo salió mal'});
			}
			else {

				if(req.body.eliminar_uni < 1 || req.body.eliminar_top < 1) {
					return res.json({exito:false});
				}
				var usuario = require('./modelos/panel_profe');
				usuario.tirarPapeleraTop(req.body.hacia, req.body.eliminar_uni,req.body.eliminar_top,function(c) {
					if(c==false) {
						return res.json({exito:false,mensaje:'Algo salió mal'});
					}
					else {
						return res.json({exito:true});
					}
				});
			}
		}
	}
	else {
		res.json({exito:false,mensaje:'Algo salió mal'});
	}
});
app.post('/a_papelera_con', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.eliminar_uni==null || req.body.eliminar_top==null || req.body.eliminar_con==null || req.body.hacia==null) {
				return res.json({exito:false,mensaje:'Algo salió mal'});
			}
			else {

				if(req.body.eliminar_uni < 1 || req.body.eliminar_top < 1 || req.body.eliminar_con < 1) {
					return res.json({exito:false});
				}
				var usuario = require('./modelos/panel_profe');
				usuario.tirarPapeleraCon(req.body.hacia, req.body.eliminar_uni,req.body.eliminar_top,req.body.eliminar_con,function(c) {
					if(c==false) {
						return res.json({exito:false,mensaje:'Algo salió mal'});
					}
					else {
						return res.json({exito:true});
					}
				});
			}
		}
	}
	else {
		res.json({exito:false,mensaje:'Algo salió mal'});
	}
});

app.post('/reordenarUnidades', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.nu_unidades==null) {
				return res.json({exito:false,mensaje:'Algo salió mal'});
			}
			else {
				for(var i=0; i<req.body.nu_unidades.length; i++) {
					if(req.body.nu_unidades[i].id == -1) {
						return res.json({exito:false});
					}
					else if(req.body.nu_unidades[i].pos < 1) {
						return res.json({exito:false});
					}
				}
				var usuario = require('./modelos/panel_profe');
				usuario.updateUnidades(req.body.nu_unidades,function(c) {
					if(c==false) {
						return res.json({exito:false,mensaje:'Algo salió mal'});
					}
					else {
						return res.json({exito:true});
					}
				});
			}
		}
	}
	else {
		res.json({exito:false,mensaje:'Algo salió mal'});
	}
});
app.post('/reordenarTopicos', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.nu_topicos==null || req.body.nu_id_uni == null) {
				return res.json({exito:false,mensaje:'Algo salió mal'});
			}
			else {
				if(req.body.nu_id_uni<1) {
					return res.json({exito:false});
				}
				for(var i=0; i<req.body.nu_topicos.length; i++) {
					if(req.body.nu_topicos[i].id == -1) {
						return res.json({exito:false});
					}
					else if(req.body.nu_topicos[i].pos < 1) {
						return res.json({exito:false});
					}
				}
				var usuario = require('./modelos/panel_profe');
				usuario.updateTopicos(req.body.nu_id_uni,req.body.nu_topicos,function(c) {
					if(c==false) {
						return res.json({exito:false,mensaje:'Algo salió mal'});
					}
					else {
						return res.json({exito:true});
					}
				});
			}
		}
	}
	else {
		res.json({exito:false,mensaje:'Algo salió mal'});
	}
});
app.post('/reordenarContenidos', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.nu_id_top==null || req.body.nu_id_uni == null || req.body.nu_contenidos == null) {
				return res.json({exito:false,mensaje:'Algo salió mal'});
			}
			else {
				if(req.body.nu_id_uni<1 || req.body.nu_id_top<1) {
					return res.json({exito:false});
				}
				for(var i=0; i<req.body.nu_contenidos.length; i++) {
					if(req.body.nu_contenidos[i].id == -1) {
						return res.json({exito:false});
					}
					else if(req.body.nu_contenidos[i].pos < 1) {
						return res.json({exito:false});
					}
				}
				var usuario = require('./modelos/panel_profe');
				usuario.updateContenidos(req.body.nu_id_uni,req.body.nu_id_top,req.body.nu_contenidos,function(c) {
					if(c==false) {
						return res.json({exito:false,mensaje:'Algo salió mal'});
					}
					else {
						return res.json({exito:true});
					}
				});
			}
		}
	}
	else {
		res.json({exito:false,mensaje:'Algo salió mal'});
	}
});

app.get('/unidades', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var unidades = require('./modelos/contenidos1');
		unidades.lista_unidades(false,function(err,uns) {
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

app.get('/filtro_papelera/:si', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var unidades = require('./modelos/panel_profe');
		var pap;
		if(req.params.si == 1) {
			pap = true;
		}
		else {
			pap = false;
		}
		unidades.papeleraka(pap,function(err,uns) {
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

app.get('/filtro_papelera_con/:uni/:top/:si', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var unidades = require('./modelos/panel_profe');
		var pap;
		if(req.params.si == 1) {
			pap = true;
		}
		else {
			pap = false;
		}
		unidades.papelera_con_ka(req.params.uni,req.params.top,pap,function(err,tops) {
			if(err) {
				res.json({exito:false});
			}
			else {
				var etiquetas = require('./modelos/contenidos1');
				etiquetas.etiquetas(function(err,ets) {
					if(err) {
						res.json({exito:false});
					}
					else {
						res.json({exito:true,cosas:{etiquetas:ets,contenidos:tops}});
					}
				});
			}
		});
	}
	else {
		res.json({exito:false});
	}
});

app.get('/filtro_papelera_tops/:uni/:si', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var unidades = require('./modelos/panel_profe');
		var pap;
		if(req.params.si == 1) {
			pap = true;
		}
		else {
			pap = false;
		}
		unidades.papelera_top_ka(req.params.uni,pap,function(err,tops) {
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

app.get('/unidad_topicos/:uni',function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var unidades = require('./modelos/contenidos1');
		unidades.lista_unidad_topico(false,req.params.uni, function(err,tops) {
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

module.exports = app;
