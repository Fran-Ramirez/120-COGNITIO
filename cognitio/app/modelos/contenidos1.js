exports.lista_unidades = function(visi, next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			var consulta;
			if(visi==false) {
				consulta = "SELECT id,titulo FROM Unidad ORDER BY pos";
			}
			else {
				consulta = "SELECT id,titulo FROM Unidad WHERE visible=1 ORDER BY pos";
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

exports.lista_unidad_topico = function(visi, id_uni, next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			var consulta;
			if(visi==false) {
				consulta = "SELECT id,titulo FROM Topico WHERE (visible=1 AND id_uni=?) ORDER BY pos";
			}
			else {
				consulta = "SELECT id,titulo FROM Topico WHERE (id_uni=?) ORDER BY pos";
			}
			conexion.query(consulta, [id_uni], function(err, rows) {
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

exports.lista_un_to_co = function(correo,id_uni,id_top,next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			conexion.query("select titulo,info,archivo,id,id_uni,id_top from Contenido where id_uni=? and id_top=? and visible = 1 and etiqueta_id in (select etiqueta_id from Perfil_Etiqueta join Etiqueta on Perfil_Etiqueta.etiqueta_id = Etiqueta.id and Perfil_Etiqueta.perfil_id=(select perfil_id from Estudiante where correo=?)) ORDER BY pos", [id_uni, id_top,correo], function(err, rows) {
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

exports.etiquetas = function(next) {
	pool.getConnection(function(err,conexion){
        if (err) {

        }
        else {
			conexion.query("select id,nombre_etiqueta,descripcion from Etiqueta", function(err, rows) {
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
exports.addFeedback= function(tipo,unidad,topico,contenido,comentario,rol,next) {
	pool.getConnection(function(err,conexion){
    if (err) {

    }
    else {
			conexion.query("INSERT INTO Feedback (rol,calificacion,comentario,uni_id,top_id,com_id) VALUES (?,?,?,?,?,?)", [rol,tipo,comentario,unidad,topico,contenido], function(err, rows) {
				if (err) {
					console.log(err);
					conexion.release();
					next(false);
				}
				else {
					conexion.release();
					next(true);
				}
			});
		}
	});
};
