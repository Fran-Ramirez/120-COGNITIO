var crypto = require('crypto'),
    algorithm = 'aes-256-cbc',
    password = 'fb589c13';

var encrypt = function(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
};
exports.encriptar = encrypt;

var decrypt = function(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
};
exports.desencriptar = decrypt;

exports.crear = function(usuario, pass, rol, next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			var safe = encrypt(pass);
			var r = rol.split('-');
			conexion.query("INSERT INTO Estudiante (rol,dv,correo,password,test) VALUES (?,?,?,?,0)",[r[0],r[1],usuario,safe], function(err, rows) {
				if (err) {
					conexion.release();
					next(err,false);
				}
				else {
					conexion.release();
					next(null,true);
				}
			});
		}
	});
};

exports.ver = function(usuario, pass, next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			conexion.query("SELECT rol,correo,password,test FROM Estudiante WHERE correo=?", [usuario], function(err, rows) {
				if (err) {
					conexion.release();
					next(err,false);
				}
				else {
					if(rows.length > 0) {
						var psswd_bd = decrypt(rows[0].password);
						conexion.release();
						if(psswd_bd == pass) {
							next(null,rows[0]);
						}
						else {
							next(null,false);
						}
					}
					else {
						conexion.release();
						next(null,false);
					}
				}
			});
		}
	});
};

exports.setTest = function(usuario,pass,resultado, callback) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			conexion.query("UPDATE Estudiante SET perfil_id=?,test=1 WHERE (correo=? AND password=?)", [resultado,usuario,pass], function(err,rows) {
				if(err) {
					conexion.release();
					callback(err,null);
				}
				else {
					var c = Object.keys(rows).length;
					if(c > 0) {
						conexion.release();
						callback(null,true);
					}
					else {
						conexion.release();
						callback(null,false);
					}
				}
			});
		}
	});
};

exports.getTest = function(usuario,pass,callback) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			conexion.query("SELECT test FROM Estudiante WHERE (correo=? AND password=?)", [usuario,pass], function(err, rows){
				if (err) {
					conexion.release();
					callback(err,null);
				}
				else {
					if(rows.length > 0) {
						if(rows[0].test == 0) {
							conexion.release();
							callback(null,false);
						}
						else {
							conexion.release();
							callback(null,true);
						}
					}
					else {
						conexion.release();
						callback(null,null);
					}
				}
			});
		}
	});
};
