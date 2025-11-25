'use strict'

var express = require('express');
var UsuariosController = require('../Controller/usuariosController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({uploadDir: './uploads'});

//Endpoints

//Inicio
enrutador.get('/testUsuario', UsuariosController.testUsuarios);

//Ver todos los usuarios
enrutador.get('/usuarios', UsuariosController.verUsuarios);

//Ver usuario específico
enrutador.get('/usuarios/:id', UsuariosController.verUsuario);

//Guardar un usuario
enrutador.post('/guardar-usuario', UsuariosController.guardarUsuarios);

//Actualizar un usuario
enrutador.put('/usuarios/:id', UsuariosController.actualizarUsuario);

//Borrar un usuario
enrutador.delete('/usuarios/:id', UsuariosController.deleteUsuarios);

//Agregar imagen
enrutador.post('/subir-imagenUsuario/:id', multiPartyMiddleware, UsuariosController.cargarImagen);

//Cargar las imagenes
enrutador.get('/tener-imagenUsuario/:imagen' , UsuariosController.tenerImagen);

module.exports = enrutador;