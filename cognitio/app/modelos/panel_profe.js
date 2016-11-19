var crypto = require('crypto'),
    algorithm = 'aes-256-cbc',
    password = 'fb589c13';

var encrypt = function(text){
  var cipher = crypto.createCipher(algorithm,password);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
};
exports.encriptar = encrypt;
 
var decrypt = function(text){
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
};
exports.desencriptar = decrypt;

exports.tipo_profe = function(usuario,pass,callback) {
	pool.getConnection(function(err,conexion){
        if (err) {
			
        }
        else {
			conexion.query("SELECT coordinador FROM Profesor WHERE correo=? AND password=?",[usuario,pass], function(err, rows) {
				if (err) {
					conexion.release();
					callback(err,null);
				}
				else {
					if(rows.length > 0) {
						if(rows[0].coordinador == 0) {
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
