var app = require('express').Router();

app.get('/checklogin', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		return res.json({exito:true,datos:sess});
	}
	res.json({exito:false,correos:['@alumnos.usm.cl','@sansano.usm.cl']});
});

app.get('/logout', function(req,res) {
	req.session.destroy(function(err) {
		if(err) {
			console.log(err);
			res.json({exito:false});
		} else {
			res.json({exito:true});
		}
	});
});

// route to handle creating goes here (app.post)
app.post('/signup', function(req,res) {
	if(!req.body.correo || !req.body.dominio || !req.body.rol || !req.body.password) {
		res.json({exito:false,mensaje:'Introducir correo, rol y contrasena'});
	} 
	else {
		var mail = req.body.correo+req.body.dominio;
		var test_rol = /^\d+\-[k|K|\d]$/g;
		var test_correo = /^[a-z]+\.[a-z]+(?:\.[1-9]\d)?$/g;
		if(!test_correo.test(req.body.correo) || !test_rol.test(req.body.rol)) {
			delete test_rol;
			delete test_correo;
			res.json({exito:false,mensaje:'Uno de los campos está incorrecto'});
		}
		else {
			delete test_rol;
			delete test_correo;
			var usuario = require('./modelos/usuario');
			usuario.crear(mail,req.body.password,req.body.rol, function(error,resultado) {
				if(error) {
					return res.json({exito:false,mensaje:'Usuario ya existente'});
				}
				res.json({exito:true,mensaje:'Usuario registrado'});
			});
		}
	}
});

app.post('/autenticacion', function(req,res) {
	var usuario = require('./modelos/usuario');
	var mail= req.body.correo+req.body.dominio;
	usuario.ver(mail, req.body.password, function(error, user) {
		if(error) {
			return res.json({exito:false,mensaje:'Algo salio mal'});
		}
		
		if(user===false) {
			return res.json({exito:false,mensaje:'Usuario o contraseña incorrecto'});
		}
		else {
			var sess = req.session;
			sess.correo = usuario.encriptar(mail);
			sess.passwd = user.password;
			sess.extra = usuario.encriptar(req.body.dominio);
			if(user.perfil_id == null) {
				sess.skip = false;
			}
			sess.cookie.expires = new Date(Date.now()+86400000);
			console.log(user);
			res.json({exito:true});
		}
	});
});

module.exports = app;
