'use strict'

var express = require('express');
var EmpleadoController = require('../Controller/empleadoController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });

//para el auth de JWS
var auth = require('../middlewares/auth');

//Endpoints

//Inicio
enrutador.get('/home-empleado', EmpleadoController.home);

//Ver todos los empleados
enrutador.get('/empleados', auth, EmpleadoController.verEmpleados);

//Ver empleado específico
enrutador.get('/empleados/:id', auth, EmpleadoController.verEmpleado);

//Guardar un empleado
enrutador.post('/guardar-empleado', EmpleadoController.guardarEmpleados);

//Actualizar un empleado
enrutador.put('/empleados/:id', auth, EmpleadoController.actualizarEmpleados);

//Borrar un empleado
enrutador.delete('/empleados/:id', auth, EmpleadoController.deleteEmpleados);

//Agregar imagen
enrutador.post('/subir-imagenEmpleado/:id', auth, multiPartyMiddleware, EmpleadoController.cargarImagenEmpleado);

//Cargar las imagenes
enrutador.get('/tener-imagenEmpleado/:imagen', EmpleadoController.tenerImagenEmpleado);

//Login empleado
enrutador.post('/login-empleado', EmpleadoController.loginEmpleado);

module.exports = enrutador;