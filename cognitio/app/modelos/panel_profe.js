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

exports.updateUnidades = function(unidades,callback) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			var pendientes = unidades.length;
			conexion.query("START TRANSACTION");
			for(var i=0; i<unidades.length;i++) {
				conexion.query("UPDATE Unidad SET pos=? WHERE (id=?)",[unidades[i].pos,unidades[i].id], function(err, rows) {
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
};

exports.updateTopicos = function(unidad, topicos,callback) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			var pendientes = topicos.length;
			conexion.query("START TRANSACTION");
			for(var i=0; i<topicos.length;i++) {
				conexion.query("UPDATE Topico SET pos=? WHERE (id=? AND id_uni=?)",[topicos[i].pos,topicos[i].id, unidad], function(err, rows) {
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
};
exports.updateContenidos = function(unidad, topico, contenidos, callback) {
	pool.getConnection(function(err,conexion){
    if (err) {

    }
    else {
			var pendientes = contenidos.length;
			conexion.query("START TRANSACTION");
			for(var i=0; i<contenidos.length;i++) {
				conexion.query("UPDATE Contenido SET pos=? WHERE (id=? AND id_uni=? AND id_top=?)",[contenidos[i].pos,contenidos[i].id, unidad, topico], function(err, rows) {
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
};

exports.actualizarUnidad = function(id, titulo, descripcion, callback) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			conexion.query("UPDATE Unidad SET titulo=?, descripcion=? WHERE (id=?)",[titulo, descripcion, id], function(err, rows) {
				if(err) {
					conexion.release();
					callback(false);
				}
				else {
					conexion.release();
					callback(true);
				}
			});
		}
	});
};

exports.actualizarTopico = function(id, id_uni, titulo, descripcion, callback) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			conexion.query("UPDATE Topico SET titulo=?, descripcion=? WHERE (id=? AND id_uni=?)",[titulo, descripcion, id, id_uni], function(err, rows) {
				if(err) {
					conexion.release();
					callback(false);
				}
				else {
					conexion.release();
					callback(true);
				}
			});
		}
	});
};

exports.tirarPapelera = function(hacia, id, callback) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			var consulta;
			if(hacia) {
				consulta = "UPDATE Unidad SET visible=0 WHERE (id=?)";
			}
			else {
				consulta = "UPDATE Unidad SET visible=1 WHERE (id=?)";
			}
			conexion.query(consulta ,[id], function(err, rows) {
				if(err) {
					conexion.release();
					callback(false);
				}
				else {
					conexion.release();
					callback(true);
				}
			});
		}
	});
};
exports.tirarPapeleraTop = function(hacia, id_uni, id, callback) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			var consulta;
			if(hacia) {
				consulta = "UPDATE Topico SET visible=0 WHERE (id=? && id_uni=?)";
			}
			else {
				consulta = "UPDATE Topico SET visible=1 WHERE (id=? && id_uni=?)";
			}
			conexion.query(consulta ,[id,id_uni], function(err, rows) {
				if(err) {
					conexion.release();
					callback(false);
				}
				else {
					conexion.release();
					callback(true);
				}
			});
		}
	});
};
exports.tirarPapeleraCon = function(hacia, id_uni, id_top, id, callback) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			var consulta;
			if(hacia) {
				consulta = "UPDATE Contenido SET visible=0 WHERE (id=? AND id_uni=? AND id_top=?)";
			}
			else {
				consulta = "UPDATE Contenido SET visible=1 WHERE (id=? AND id_uni=? AND id_top=?)";
			}
			conexion.query(consulta ,[id,id_uni,id_top], function(err, rows) {
				if(err) {
					conexion.release();
					callback(false);
				}
				else {
					conexion.release();
					callback(true);
				}
			});
		}
	});
};

exports.papeleraka = function(pape, next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			var consulta;
			if(pape==false) {
				consulta = "SELECT id,titulo,descripcion,pos FROM Unidad WHERE visible=1 ORDER BY pos";
			}
			else {
				consulta = "SELECT id,titulo FROM Unidad WHERE visible=0 ORDER BY pos";
			}
			conexion.query(consulta, function(err, rows) {
				if (err) {
					conexion.release();
					next(err,null);
				}
				else {
					conexion.release();
					next(null,rows);
				}
			});
		}
	});
};

exports.devolverFeedback = function(next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			conexion.query("select f.rol as rol,f.comentario as comentario,f.uni_id as uni_id,f.top_id as top_id,f.com_id as com_id,c.titulo as contenido,t.titulo as topico,u.titulo as unidad FROM Feedback as f JOIN Contenido as c ON c.id_uni = f.uni_id AND c.id_top = f.top_id AND c.id = f.com_id JOIN Topico as t ON t.id_uni = f.uni_id AND t.id = f.top_id JOIN Unidad as u ON u.id = f.uni_id WHERE calificacion=0", function(err, rows) {
				if (err) {
					conexion.release();
					next(err,null);
				}
				else {
					conexion.release();
					next(null,rows);
				}
			});
		}
	});
};

exports.papelera_top_ka = function(uni, pape, next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
    			var consulta;
    			if(pape==false) {
    				consulta = "SELECT id,titulo,descripcion,pos FROM Topico WHERE (visible=1 AND id_uni=?) ORDER BY pos";
    			}
    			else {
    				consulta = "SELECT id,titulo FROM Topico WHERE (visible=0 AND id_uni=?) ORDER BY pos";
    			}
    			conexion.query(consulta, [uni], function(err, rows) {
    				if (err) {
    					conexion.release();
    					next(err,null);
    				}
    				else {
    					conexion.release();
    					next(null,rows);
    				}
    			});
		}
	});
};

exports.papelera_con_ka = function(uni, top, pape, next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			var consulta;
			if(pape==false) {
				consulta = "SELECT id,titulo,info,pos,etiqueta_id FROM Contenido WHERE (visible=1 AND id_uni=? AND id_top=? AND borrador=0) ORDER BY pos";
			}
			else {
				consulta = "SELECT id,titulo,info,pos,etiqueta_id FROM Contenido WHERE (visible=0 AND id_uni=? AND id_top=? AND borrador=0) ORDER BY pos";
			}
			conexion.query(consulta, [uni,top], function(err, rows) {
				if (err) {
					conexion.release();
					next(err,null);
				}
				else {
					conexion.release();
					next(null,rows);
				}
			});
		}
	});
};

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

exports.actualizar_contenido = function(tipo,unidad,topico,titulo,info,etiqueta,v_unidad,v_topico,v_con,pos,callback) {
	pool.getConnection(function(err,conexion){
    if (err) {

    }
    else {
			if(tipo==0) {
        conexion.query("START TRANSACTION");
				conexion.query("INSERT INTO Contenido (id_uni,id_top,titulo,info,borrador,etiqueta_id,pos) VALUES (?,?,?,?,0,?,?)", [unidad,topico,titulo,info,etiqueta,pos], function(err, rows) {
					if(err) {
						conexion.release();
						callback(false);
					}
					else {
            conexion.query("CALL moverFeedback(?,?,?,?,?,(SELECT MAX(id) FROM Contenido WHERE id_uni = ? AND id_top=?))",[v_unidad,v_topico,v_con,unidad,topico,unidad,topico]);
            conexion.query("DELETE FROM Contenido WHERE (id_uni=? AND id_top=? AND id=?)", [v_unidad,v_topico,v_con], function(err, rows) {
              if(err) {
                conexion.query("ROLLBACK");
                conexion.release();
                callback(false);
              }
              else {
                conexion.query("COMMIT");
                conexion.release();
                callback(true);
              }
            });
					}
				});
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
						var top_id;
						conexion.query("SELECT MAX(id) FROM Topico WHERE id_uni=?", [unidad], function(err,row) {
							if(err) {
								conexion.query("ROLLBACK");
								conexion.release();
								callback(false);
							}
							else {
								top_id = row[0]['MAX(id)'];
                conexion.query("INSERT INTO Contenido (id_uni,id_top,titulo,info,borrador,etiqueta_id) VALUES (?,?,?,?,0,?)",[unidad,top_id,titulo,info,etiqueta], function(err, rows) {
									if(err) {
										conexion.query("ROLLBACK");
										conexion.release();
										callback(false);
									}
									else {
                    conexion.query("CALL moverFeedback(?,?,?,?,?,(SELECT MAX(id) FROM Contenido WHERE id_uni = ? AND id_top=?))",[v_unidad,v_topico,v_con,unidad,top_id,unidad,top_id]);
                    conexion.query("DELETE FROM Contenido WHERE (id_uni=? AND id_top=? AND id=?)", [v_unidad,v_topico,v_con], function(err, rows) {
                      if(err) {
                        conexion.query("ROLLBACK");
                        conexion.release();
                        callback(false);
                      }
                      else {
                        conexion.query("COMMIT");
                        conexion.release();
                        callback(true);
                      }
                    });
									}
								});
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
						conexion.query("SELECT MAX(id) FROM Unidad", function(err,row) {
							if(err) {
								conexion.query("ROLLBACK");
								conexion.release();
								callback(false);
							}
							else {
								var uni_id = row[0]['MAX(id)'];
								conexion.query("INSERT INTO Topico (id_uni, titulo, descripcion) VALUES (?,?,?)",[uni_id,topico.titulo,topico.descripcion], function(err,row) {
									if(err) {
										conexion.query("ROLLBACK");
										conexion.release();
										callback(false);
									}
									else {
										conexion.query("SELECT MAX(id) FROM Topico WHERE (id_uni=?)", [uni_id], function(err,row) {
											if(err) {
												conexion.query("ROLLBACK");
												conexion.release();
												callback(false);
											}
											else {
												var top_id = row[0]['MAX(id)'];
												conexion.query("INSERT INTO Contenido (id_uni,id_top,titulo,info,borrador,etiqueta_id) VALUES (?,?,?,?,0,?)",[uni_id,top_id,titulo,info,etiqueta], function(err, rows) {
													if(err) {
														conexion.query("ROLLBACK");
														conexion.release();
														callback(false);
													}
													else {
                            conexion.query("CALL moverFeedback(?,?,?,?,?,(SELECT MAX(id) FROM Contenido WHERE id_uni = ? AND id_top=?))",[v_unidad,v_topico,v_con,uni_id,top_id,uni_id,top_id]);
                            conexion.query("DELETE FROM Contenido WHERE (id_uni=? AND id_top=? AND id=?)", [v_unidad,v_topico,v_con], function(err, rows) {
                              if(err) {
                                conexion.query("ROLLBACK");
                                conexion.release();
                                callback(false);
                              }
                              else {
                                conexion.query("COMMIT");
                                conexion.release();
                                callback(true);
                              }
                            });
													}
												});
											}
										});
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
exports.subir_contenido = function(tipo,unidad,topico,contenidos,callback) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			if(tipo==0) {
				var pendientes = Object.keys(contenidos).length;
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
						var top_id;
						conexion.query("SELECT MAX(id) FROM Topico WHERE id_uni=?", [unidad], function(err,row) {
							if(err) {
								conexion.query("ROLLBACK");
								conexion.release();
								callback(false);
							}
							else {
								top_id = row[0]['MAX(id)'];
								var pendientes = Object.keys(contenidos).length;
								for(var llave in contenidos) {
									conexion.query("INSERT INTO Contenido (id_uni,id_top,titulo,info,borrador,etiqueta_id) VALUES (?,?,?,?,0,?)",[unidad,top_id,contenidos[llave].titulo,contenidos[llave].texto,contenidos[llave].etiqueta], function(err, rows) {
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
						conexion.query("SELECT MAX(id) FROM Unidad", function(err,row) {
							if(err) {
								conexion.query("ROLLBACK");
								conexion.release();
								callback(false);
							}
							else {
								var uni_id = row[0]['MAX(id)'];
								conexion.query("INSERT INTO Topico (id_uni, titulo, descripcion) VALUES (?,?,?)",[uni_id,topico.titulo,topico.descripcion], function(err,row) {
									if(err) {
										conexion.query("ROLLBACK");
										conexion.release();
										callback(false);
									}
									else {
										conexion.query("SELECT MAX(id) FROM Topico WHERE (id_uni=?)", [uni_id], function(err,row) {
											if(err) {
												conexion.query("ROLLBACK");
												conexion.release();
												callback(false);
											}
											else {
												var top_id = row[0]['MAX(id)'];
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
				});
			}
			else {

			}
		}
	});
};
