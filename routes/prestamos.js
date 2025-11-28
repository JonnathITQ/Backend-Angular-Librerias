'use strict'

var express = require('express');
var PrestamosController = require('../Controller/prestamosController');
var enrutador = express.Router();


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