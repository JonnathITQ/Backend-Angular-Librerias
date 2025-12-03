'use strict'

var express = require('express');//Traemos express
var PrestamosController = require('../Controller/prestamosController'); //Referenciamos al controlador
var enrutador = express.Router(); //Colocamos el router para poder manejar entre rutas


//Endpoints

//test
enrutador.get('/testPrestamos', PrestamosController.testPrestamo);

// Ver todos los prestamos
enrutador.get('/listaPrestamos', PrestamosController.listaPrestamos);

//Ver prestamo en específico
enrutador.get('/listaPrestamos/:id', PrestamosController.verPrestamo);

//Guardar Prestamo
enrutador.post('/guardarPrestamo', PrestamosController.guardarPrestamo);

//Actualizar Prestamo
enrutador.put('/actualizarPrestamo/:id', PrestamosController.actualizarPrestamo);

//Borrar Prestamo
enrutador.delete('/borrarPrestamo/:id', PrestamosController.borrarPrestamo);

module.exports = enrutador;