var app = require('express').Router();

app.get('/checktest', function(req, res) {
	var sess = req.session;
	if(sess.correo && sess.passwd) {
		var usuario = require('./modelos/usuario');
		var pass = sess.passwd;
		var correo = usuario.desencriptar(sess.correo);
		usuario.getTest(correo,pass,function(b_test) {
			if(b_test.test===1) {
				return res.json({test:true});
			}
			else if(b_test.test===0) {
				return res.json({test:false});
			}
		});
	}
	res.json({exito:-1});
});

module.exports = app;
