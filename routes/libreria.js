'use strict'

var express = require('express'); //Traemos el express
var LibrosController = require('../Controller/librosController'); //Referencia al controlador
var HistorialController = require('../Controller/historialController');

var enrutador = express.Router(); //Traemos el router

var multipart = require('connect-multiparty'); //traemos el multiparty
var multiPartMiddleware = multipart({ uploadDir: './uploads' }); //Aplicamos el middleware para la carpeta de uploads

//Endpoints

//Inicio
enrutador.get('/test', LibrosController.test);

//Guardar la información del libro
enrutador.post('/guardar-libros', LibrosController.guardarLibros);

//Ver todos los libros
enrutador.get('/libros', LibrosController.verLibros);

//Ver un libro en específico
enrutador.get('/libros/:id', LibrosController.verLibro);

//Eliminar libro
enrutador.delete('/libros/:id', LibrosController.borrarLibros);

//Actualizar información del libro
enrutador.put('/libros/:id', LibrosController.actualizarLibros);

//Agregar imagen
enrutador.post('/subir-portada/:id', multiPartMiddleware, LibrosController.cargarPortada);

//Cargar las imagenes
enrutador.get('/tener-portada/:portada', LibrosController.tenerPortada);

// Rutas de Historial
enrutador.post('/historial', HistorialController.agregarHistorial);

enrutador.get('/historial/:idUsuario', HistorialController.verHistorialUsuario);

module.exports = enrutador;



