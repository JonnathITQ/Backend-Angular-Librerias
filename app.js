//1) Usamos el use strict para activar el modo estricto de javascript, es decir, para que no se puedan usar variables sin declarar
'use strict'

//2) Creamos las variables express, bodyParser, app y tienda_routes
var express = require('express'); // express = módulo que se encarga de crear el servidor
var bodyParser = require('body-parser'); // bodyParser = módulo que se encarga de parsear el body de las peticiones
var app = express(); // app = módulo que se encarga de crear el servidor
var libreria_routes = require('./route/libros'); // libreria_routes = módulo que se encarga de manejar las rutas de la librería

//3) Usamos el app.use((res, req, next)=> { }) para manejar los headers de las peticiones
app.use((res, req, next)=> { 
   res.header('Access-Control-Allow-Origin', '*'); // Access-Control-Allow-Origin = header que se encarga de permitir que el cliente acceda a los recursos del servidor
   // Access-Control-Allow-Headers = header que se encarga de permitir que el cliente acceda a los headers de las peticiones
   // Authorization = header que se encarga de autenticar al cliente
   // X-API-KEY = header que se encarga de autenticar al cliente
   // X-Request-With = header que se encarga de indicar que el cliente está enviando una petición asíncrona
   // Content-Type = header que se encarga de indicar el tipo de contenido que se está enviando
   // Accept = header que se encarga de indicar el tipo de contenido que el cliente está aceptando
   // Access-Control-Allow = header que se encarga de indicar que el cliente está permitido acceder a los recursos del servidor
   // Request-Method = header que se encarga de indicar el método HTTP que se está usando
   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, X-Request-With,Content-Type,Accept, Access-Control-Allow, Request-Method');
   // Access-Control-Allows-Method = header que se encarga de permitir que el cliente acceda a los métodos HTTP
   res.header('Access-Control-Allows-Method', 'GET,POST,OPTIONS,PUT,DELETE');
   // Allow = header que se encarga de indicar los métodos HTTP que el cliente está permitido usar
   res.header('Allow', 'GET,POST,OPTIONS,PUT,DELETE');
   // next() = método que se encarga de pasar la petición al siguiente middleware
   next(); 
})

//4) Usamos el app.use('/') para manejar las rutas de la librería 
// libreria_routes = módulo que se encarga de manejar las rutas de la librería
app.use('/', libreria_routes);

//5) Exportamos el módulo app para que pueda ser usado en otras partes de la aplicación
module.exports= app;