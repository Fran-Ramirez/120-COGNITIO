var jwt = require('jwt-simple');  
var moment = require('moment');  

exports.crearToken = function() {  
	var payload = {
		sub: 1,
		iat: moment().unix(),
		exp: moment().add(14, "days").unix(),
	};
	return jwt.encode(payload, "ultrasecreto");
};
