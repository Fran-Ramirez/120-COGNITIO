var app = require('express').Router();

app.get('/checktest', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var usuario = require('./modelos/usuario');
		var pass = sess.passwd;
		var correo = usuario.desencriptar(sess.correo);
		usuario.getTest(correo,pass,function(err, b_test) {
			if(err || b_test == null) {
				res.json({exito:-1});
			}
			else {
				if(b_test == false) {
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

module.exports = app;
