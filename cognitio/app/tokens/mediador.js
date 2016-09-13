var jwt = require('jwt-simple');  
var moment = require('moment'); 

exports.Autenticacion = function(req, res, next) {  
	var informacion = { 
		message:'',
		correos:[{dominio:"@sansano.usm.cl"},{dominio:"@alumnos.usm.cl"}]};
	if(!req.headers.authorization) {
		informacion.message='Debes ingresar tu cuenta para usar la plataforma';
		return res.status(403).json(informacion);
	}

	var token = req.headers.authorization.split(" ")[1];
	var payload = jwt.decode(token, config.TOKEN_SECRET);

	if(payload.exp <= moment().unix()) {
		informacion.message="La sesion ha expirado";
		return res.status(401).json(informacion);
	}

	req.user = payload.sub;
	next();
}
