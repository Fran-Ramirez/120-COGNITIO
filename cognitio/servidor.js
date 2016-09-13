var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var passport	   = require('passport');

var port = process.env.PORT || 8080; 

app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/public')); 

app.use(passport.initialize());
require('./config/passport');
require('./app/rutas')(app); 

app.listen(port);               
                    
console.log('burakku ' + port);
          
exports = module.exports = app;          
