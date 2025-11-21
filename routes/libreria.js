'use strict'

var express = require('express');
var LibrosController = require('../controller/libros')

var enrutador = express.Router();

var multipart = require('connect-multiparty');
const { route } = require('../app');
var multiPartMiddleware = multipart({ uploadDir: './uploads' });

//Endpoints

//Inicio
enrutador.get('/home', LibrosController.home);

//Guardar la información del libro
enrutador.post('/guardar-libros', LibrosController.guardarLibro);

//Ver todos los libros
enrutador.get('/libros', LibrosController.verLibros);

//Ver un libro en específico
enrutador.get('/libros/:id', LibrosController.verLibros);

//Eliminar libro
enrutador.delete('/libros/:id', LibrosController.borrarLibro);

//Actualizar información del libro
enrutador.put('/libros/:id'.LibrosController.actualizarLibro);

//Agregar imagen
enrutador.post('/subir-imagen/:id'.multiPartMiddleware, LibrosController.cargarImagen);

//Cargar las imagenes
enrutador.get('/tener-imagen/:imagen', LibrosController.tenerImagen);

module.exports = enrutador;




