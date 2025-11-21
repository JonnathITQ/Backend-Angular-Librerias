// 1) sirve para activar el modo estricto de javascript, es decir, para que no se puedan usar variables sin declarar
'use strict'

//2) importamos el modulo mongoose para poder conectarnos a la base de datos y el puerto en el que va a correr el servidor
var mongoose = require('mongoose');
var port= '3600';

//3) configuramos mongoose para que use las promesas de javascript
//las promesas en js son objetos que representan la eventual finalización (o falla) de una operación asíncrona y sus valores resultantes.
mongoose.promise= global.Promise;

//4) Creamos esta variable para importar el archivo app.js donde se encuentra la configuración del servidor
var app = require('./app');

//5) Conexión con la BDD
mongoose.connect('mongodb://localhost:27017/EntreLetras').then(()=>{ // mongoose.connect = método que se encarga de conectarse a la base de datos
    console.log('Conexión encontrada, procesando...');

    app.listen(port,()=>{ // app.listen = método que se encarga de escuchar las peticiones que vienen del cliente
        console.log('La conexión fue establecida exitosamente :)');
    })
})
.catch(err=>console.log(err)); // .catch = método que se encarga de capturar los errores que puedan ocurrir en la conexión con la base de datos


