module.exports = function(app) {

	app.get('/checklogin', function(req, res) {
		console.log(req.headers);
		if(req.isAuthenticated()) {
			console.log("pilos");
			return res.json({exito:true});
		}
		res.json({exito:false,correos:['@alumnos.usm.cl','@sansano.usm.cl']});
	});

	// route to handle creating goes here (app.post)
	app.post('/signup', function(req,res) {
		if(!req.body.correo || !req.body.dominio || !req.body.rol || !req.body.password) {
			res.json({exito:false,mensaje:'Introducir correo, rol y contrasena'});
		} 
		else {
			var usuario = require('./modelos/usuario');
			var mail= req.body.correo+req.body.dominio;
			usuario.crear(mail,req.body.password,req.body.rol, function(error,resultado) {
				if(error) {
					return res.json({exito:false,mensaje:'Usuario ya existente'});
				}
				res.json({exito:true,mensaje:'Usuario registrado'});
			});
		}
	});
	
	app.post('/autenticacion', function(req,res) {
		var usuario = require('./modelos/usuario');
		var mail= req.body.correo+req.body.dominio;
		usuario.ver(mail, req.body.password, function(error, usuario) {
			if(error) {
				res.json({exito:false,mensaje:'Algo salio mal'});
			}
			if(!usuario) {
				res.json({exito:false,mensaje:'Usuario o contraseña incorrecto'});
			}
			else {
				var config = require('../config/database');
				var jwt = require('jwt-simple');
				var token = jwt.encode(usuario, config.secret);
				console.log(token);
				res.status(200).json({exito:true,token:'JWT '+token});
			}
		});
	});
	// route to handle delete goes here (app.delete)

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/views/index.html'); // load our public/index.html file
	});
	
	

};
