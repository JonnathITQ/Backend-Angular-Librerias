'use strict'

var express = require('express');
var EmpleadoController = require('../Controller/empleadoController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({uploadDir: './uploads'});

//Endpoints

//Inicio
enrutador.get('/home-empleado', EmpleadoController.home);

//Ver todos los empleados
enrutador.get('/empleados', EmpleadoController.verEmpleados);

//Ver empleado específico
enrutador.get('/empleados/:id', EmpleadoController.verEmpleado);

//Guardar un empleado
enrutador.post('/guardar-empleado', EmpleadoController.guardarEmpleados);

//Actualizar un empleado
enrutador.put('/empleados/:id', EmpleadoController.actualizarEmpleado);

//Borrar un empleado
enrutador.delete('/empleados/:id', EmpleadoController.deleteEmpleados);

//Agregar imagen
enrutador.post('/subir-imagenEmpleado/:id', multiPartyMiddleware, EmpleadoController.cargarImagen);

//Cargar las imagenes
enrutador.get('/tener-imagenEmpleado/:imagen' , EmpleadoController.tenerImagen);

module.exports = enrutador;