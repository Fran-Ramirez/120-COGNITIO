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
