var mysql = require('mysql');
var config = require('../../config/database');

var crypto = require('crypto'),
    algorithm = 'aes-256-cbc',
    password = 'fb589c13';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.crear = function(usuario, pass, rol, next) {
	var conexion = mysql.createConnection(config);
	var safe = encrypt(pass);
	var r = rol.split('-');
	conexion.query("INSERT INTO Estudiante (rol,dv,correo,password) VALUES (?,?,?,?)",[r[0],r[1],usuario,safe], function(err, rows) {
		if (err) {
			conexion.end();
			next(err,false);
		}
		else {
			conexion.end();
			next(null,true);
		}
	});
};

exports.ver = function(usuario, pass, next) {
	var conexion = mysql.createConnection(config);
	conexion.query("SELECT correo,password FROM Estudiante WHERE correo=?", [usuario], function(err, rows) {
		if (err) {
			conexion.end();
			next(err,false);
		}
		else {
			if(rows.length > 0) {
				var psswd_bd = decrypt(rows[0].password);
				conexion.end();
				if(psswd_bd == pass) {
					next(null,rows[0]);
				}
				else {
					next(null,false);
				}
			}
			else {
				conexion.end();
				next(null,false);
			}
		}
	});
}
