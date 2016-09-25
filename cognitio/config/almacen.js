module.exports = {
	'host': 'localhost',
	'port':'3306',
	'user':'root',
	'password':'12345',
	'database':'cognitio',
	'schema':{
	'tableName':'Sesion',
	'columnNames':{
			'session_id':'id',
			'expires':'fecha',
			'data':'datos'
		}
	}	
};
