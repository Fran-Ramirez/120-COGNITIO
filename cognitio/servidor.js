var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var helmet 		   = require('helmet'); 
var session 	   = require('express-session'); 
var mysqlStore     = require('express-mysql-session')(session); 
var config   	   = require('./config/vvv'); 
var mysql		   = require('mysql');
var multer  	   = require('multer');
var config_pool    = require('./config/database');

var port = process.env.PORT || 8080; 

app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/public')); 
app.use('/ocLazyLoad', express.static(__dirname + '/node_modules/oclazyload/dist/'));
app.use('/textangular', express.static(__dirname + '/node_modules/textangular/dist/'));
app.use('/ng-file-upload', express.static(__dirname + '/node_modules/ng-file-upload/dist/'));
app.use('/ngDialog/css', express.static(__dirname + '/node_modules/ng-dialog/css/'));
app.use('/ngDialog/js', express.static(__dirname + '/node_modules/ng-dialog/js/'));
app.use('/angular-ui-sortable', express.static(__dirname + '/node_modules/angular-ui-sortable/dist/'));
app.use(helmet());

app.use(session({
	name:config.name,
	secret:config.secret,
	store: new mysqlStore(require('./config/almacen')),
	resave: true,
    saveUninitialized: true,
    unset:'destroy'
}));


global.pool = mysql.createPool(config_pool);

var storage =   multer.diskStorage({
		destination: function (req, file, callback) {
			callback(null, './public/imagenes/subidas/');
		},
		filename: function (req, file, callback) {
			callback(null, file.fieldname + '-' + Date.now());
		}
});
global.uploadFoto = multer({storage : storage}).single('userFoto');

app.use('/log', require('./app/rutas_log'));
app.use('/main', require('./app/rutas_main'));
app.use('/prof', require('./app/rutas_log_prof'));
app.use('/prof_panel', require('./app/rutas_profe_panel'));

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});

app.listen(port);               
                    
console.log('burakku ' + port);
          
exports = module.exports = app;          
