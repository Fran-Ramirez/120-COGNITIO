exports.lista_unidades = function(next) {
	pool.getConnection(function(err,conexion){
        if (err) {
			
        }
        else {
			conexion.query("SELECT id,titulo FROM Unidad WHERE visible=1", function(err, rows) {
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

exports.lista_unidad_topico = function(id_uni, next) {
	pool.getConnection(function(err,conexion){
        if (err) {
			
        }
        else {
			conexion.query("SELECT id,titulo FROM Topico WHERE visible=1 && id_uni=?", id_uni, function(err, rows) {
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
			conexion.query("select titulo,info,archivo from Contenido where id_uni=? and id_top=? and visible = 1 and etiqueta_id in (select etiqueta_id from Perfil_Etiqueta join Etiqueta on Perfil_Etiqueta.etiqueta_id = Etiqueta.id and Perfil_Etiqueta.perfil_id=(select perfil_id from Estudiante where correo=?))", [id_uni, id_top,correo], function(err, rows) {
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
