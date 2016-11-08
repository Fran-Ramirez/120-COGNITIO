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
	console.log(id_uni, id_top);
	pool.getConnection(function(err,conexion){
        if (err) {
			
        }
        else {
			conexion.query("SELECT * FROM Contenido WHERE id_uni=? && id_top=?", id_uni, id_top, function(err, rows) {
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
