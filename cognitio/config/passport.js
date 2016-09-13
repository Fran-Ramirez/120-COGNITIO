var JwtStrategy = require('passport-jwt').Strategy;
var mysql          = require('mysql');
 
//var User = require('../app/models/user');
var config = require('../config/database'); // get db config file
 
module.exports = function(passport) {
	var opts = {};
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		var conexion = mysql.createConnection(require('./config/database'));
		conexion.query("SELECT correo FROM Estudiante WHERE correo=?", [conexion.escape(jwt_payload.name)], function(err, rows) {
			conexion.end();
			if(err) {
				return done(err, false);
			}
			if(rows[0]>0) {
				console.log(rows[0]);
				return done(null,row);
			}
			else {
				return done(null, false);
			}
			
		});
      }));
};
