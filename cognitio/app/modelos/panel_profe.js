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

exports.subir_contenido = function(tipo,unidad,topico,contenidos,callback) {
	pool.getConnection(function(err,conexion){
        if (err) {
			
        }
        else {
			if(tipo==0) {
				var pendientes = Object.keys(contenidos).length;
				console.log(pendientes);
				conexion.query("START TRANSACTION");
				for(var llave in contenidos) {
					conexion.query("INSERT INTO Contenido (id_uni,id_top,titulo,info,borrador,etiqueta_id) VALUES (?,?,?,?,0,?)",[unidad,topico,contenidos[llave].titulo,contenidos[llave].texto,contenidos[llave].etiqueta], function(err, rows) {
						if(err) {
							conexion.query("ROLLBACK");
							conexion.release();
							callback(false);
						}
						else if(0 == --pendientes){
							conexion.query("COMMIT");
							conexion.release();
							callback(true);
						}
					});
				}
			}
			else if(tipo==-1) {
				conexion.query("START TRANSACTION");
				conexion.query("INSERT INTO Topico (id_uni,titulo,descripcion) VALUES (?,?,?)",[unidad,topico.titulo,topico.descripcion], function(err,row) {
					if(err) {
						conexion.query("ROLLBACK");
						conexion.release();
						callback(false);
					}
					else {
						var uni_id;
						var top_id;
						conexion.query("SELECT * FROM ____topico", function(err,row) {
							if(err) {
								conexion.query("ROLLBACK");
								conexion.release();
								callback(false);
							}
							else {
								top_id = row[0].id;
								uni_id = row[0].id_uni;
								var pendientes = Object.keys(contenidos).length;
								for(var llave in contenidos) {
									conexion.query("INSERT INTO Contenido (id_uni,id_top,titulo,info,borrador,etiqueta_id) VALUES (?,?,?,?,0,?)",[uni_id,top_id,contenidos[llave].titulo,contenidos[llave].texto,contenidos[llave].etiqueta], function(err, rows) {
										if(err) {
											conexion.query("ROLLBACK");
											conexion.release();
											callback(false);
										}
										else if(0 == --pendientes) {
											conexion.query("COMMIT");
											conexion.release();
											callback(true);
										}
									});
								}
							}
						});
					}
				});
			}
			else if(tipo==-2) {
				conexion.query("START TRANSACTION");
				conexion.query("INSERT INTO Unidad (titulo,descripcion) VALUES (?,?)",[unidad.titulo,unidad.descripcion], function(err,row) {
					if(err) {
						conexion.query("ROLLBACK");
						conexion.release();
						callback(false);
					}
					else {
						//LAST_INSERT_ID()
						conexion.query("INSERT INTO Topico (id_uni, titulo, descripcion) VALUES (LAST_INSERT_ID(),?,?)",[topico.titulo,topico.descripcion], function(err,row) {
							if(err) {
								conexion.query("ROLLBACK");
								conexion.release();
								callback(false);
							}
							else {
								var uni_id;
								var top_id;
								conexion.query("SELECT * FROM ____topico", function(err,row) {
									if(err) {
										conexion.query("ROLLBACK");
										conexion.release();
										callback(false);
									}
									else {
										top_id = row[0].id;
										uni_id = row[0].id_uni;
										var pendientes = Object.keys(contenidos).length;
										for(var llave in contenidos) {
											conexion.query("INSERT INTO Contenido (id_uni,id_top,titulo,info,borrador,etiqueta_id) VALUES (?,?,?,?,0,?)",[uni_id,top_id,contenidos[llave].titulo,contenidos[llave].texto,contenidos[llave].etiqueta], function(err, rows) {
												if(err) {
													conexion.query("ROLLBACK");
													conexion.release();
													callback(false);
												}
												else if(0 == --pendientes) {
													conexion.query("COMMIT");
													conexion.release();
													callback(true);
												}
											});
										}
									}
								});
							}
						});
					}
				});
			}
			else {
				
			}
		}
	});
};
