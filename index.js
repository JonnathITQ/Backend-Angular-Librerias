// 1) sirve para activar el modo estricto de javascript, es decir, para que no se puedan usar variables sin declarar
'use strict'

//2) importamos el modulo mongoose para poder conectarnos a la base de datos y el puerto en el que va a correr el servidor
var mongoose = require('mongoose');
var port= '3600';

//3) configuramos mongoose para que use las promesas de javascript
//las promesas en js son objetos que representan la eventual finalización (o falla) de una operación asíncrona y sus valores resultantes.
mongoose.promise= global.Promise;

var app = require('./app');
