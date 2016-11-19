var app = require('express').Router();

app.get('/checklogin', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var desencriptar = require('./modelos/usuario').desencriptar;
		if(desencriptar(sess.extra)=='@profesor.usm.cl') {
			return res.json({exito:true,datos:sess});
		}
		else if(desencriptar(sess.extra)=='@alumnos.usm.cl' || desencriptar(sess.extra)=='@sansano.usm.cl') {
			return res.json({exito:false,correos:null});
		}
	}
	res.json({exito:false,correos:['@profesor.usm.cl']});
});

app.get('/logout', function(req,res) {
	req.session.destroy(function(err) {
		if(err) {
			res.json({exito:false});
		} else {
			res.json({exito:true});
		}
	});
});

app.post('/autenticacion', function(req,res) {
	var usuario = require('./modelos/usuario_prof');
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
			sess.passwd = usuario.encriptar(user.password);
			sess.extra = usuario.encriptar(req.body.dominio);
			sess.cookie.expires = new Date(Date.now()+86400000);
			
			res.json({exito:true});
		}
	});
});

module.exports = app;
