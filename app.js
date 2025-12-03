//1) Usamos el use strict para activar el modo estricto de javascript, es decir, para que no se puedan usar variables sin declarar
'use strict'

//2) Creamos las variables express, bodyParser, app y tienda_routes
var express = require('express'); // express = módulo que se encarga de crear el servidor
var bodyParser = require('body-parser'); // bodyParser = módulo que se encarga de parsear el body de las peticiones
var app = express(); // app = módulo que se encarga de crear el servidor
var libreria_routes = require('./routes/libreria'); // libreria_routes = módulo que se encarga de manejar las rutas de la librería
var usuario_routes = require('./routes/usuarios'); // usuario_routes = módulo que se encarga de manejar las rutas de los usuarios
var empleado_routes = require('./routes/empleado'); // empleado_routes = módulo que se encarga de manejar las rutas de los empleados
var prestamos_routes = require('./routes/prestamos'); // módulo que se encarga de manejar prestamos
var log_routes = require('./routes/logs');
var est_routes = require('./routes/estadistica');

//3) Usamos el bodyParser para parsear el body de las peticiones
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//4) Usamos el app.use((req, res, next)=> { }) para manejar los headers de las peticiones
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
   next();
})

//5) Usamos el app.use('/') para manejar las rutas de la librería 
// libreria_routes = módulo que se encarga de manejar las rutas de la librería
app.use('/', libreria_routes);
// usuario_routes = módulo que se encarga de manejar las rutas de los usuarios
app.use('/', usuario_routes);
// empleado_routes = módulo que se encarga de manejar las rutas de los empleados
app.use('/', empleado_routes);
// módulo que se encarga de manejar prestamos
app.use('/', prestamos_routes);
// módulo que se encarga de manejar logs
app.use('/', log_routes);

app.use('/', est_routes);

//6) Exportamos el módulo app para que pueda ser usado en otras partes de la aplicación
module.exports = app;