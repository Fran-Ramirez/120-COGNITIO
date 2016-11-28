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

exports.ver = function(usuario, pass, next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			conexion.query("SELECT correo,password FROM Profesor WHERE (correo=? AND suspendido=0)", [usuario], function(err, rows) {
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
