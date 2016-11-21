var app = require('express').Router();

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
								{txt:"Eliminar Cuenta",fnc:"/profe_del_cuenta"},
								{txt:"Perfiles",fnc:"/profe_profiles"},
								{txt:"Modificar etiquetas",fnc:"/profe_edit_etiquetas"}
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

app.post('/uploadContents', function(req,res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			if(req.body.tipo==null || !req.body.unidad==null || !req.body.topico==null || !req.body.contenidos == null) {
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
