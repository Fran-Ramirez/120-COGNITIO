var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var helmet 		   = require('helmet'); //new
var session 	   = require('express-session'); //new
var mysqlStore     = require('express-mysql-session')(session); //new
var config   	   = require('./config/vvv'); //new

var port = process.env.PORT || 8080; 

app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/public')); 
app.use('/ocLazyLoad', express.static(__dirname + '/node_modules/oclazyload/dist/'));
app.use(helmet());

app.use(session({
	name:config.name,
	secret:config.secret,
	store: new mysqlStore(require('./config/almacen')),
	resave: true,
    saveUninitialized: true,
    unset:'destroy'
}));

var mysql = require('mysql');
var config_pool = require('./config/database');
global.pool = mysql.createPool(config_pool);

//descomentar si no funciona
//require('./app/rutas')(app); 

app.use('/log', require('./app/rutas_log'));
app.use('/main', require('./app/rutas_main'));

//test borrar esto si no sirve
app.get('*', function(req, res) {
	res.sendfile('./public/views/index.html'); // load our public/index.html file
});

app.listen(port);               
                    
console.log('burakku ' + port);
          
exports = module.exports = app;          
