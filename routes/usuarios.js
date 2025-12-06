'use strict'

var express = require('express');
var enrutador = express.Router();
var usuariosController = require('../Controller/usuariosController');
var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });
var auth = require('../middlewares/auth');

//Lista de usuarios
enrutador.get('/usuarios', usuariosController.verUsuarios);
//Ver usuario por id (usuario específico)
enrutador.get('/usuario/:id', usuariosController.verUsuario);
//Post para poder guardar el usuario
enrutador.post('/guardar-usuarios', usuariosController.guardarUsuarios);
//Actualizar usuario
enrutador.put('/usuario/:id', usuariosController.actualizarUsuario);
//Borrar usuario
enrutador.delete('/usuario/:id', usuariosController.deleteUsuarios);
//Cargar la imagen para el usuario (subir la imagen)
enrutador.post('/cargar-imagenUsuario/:id', multiPartyMiddleware, usuariosController.cargarImagenUsuario);
//Visualizar la imagen del usuario
enrutador.get('/tener-imagenUsuario/:imagen', usuariosController.tenerImagenUsuario);
//Login para el usuario
enrutador.post('/login-usuario', usuariosController.loginUsuario);
//recuperar la contraseña
enrutador.post('/recuperar-contrasenia', usuariosController.recuperarContrasenia);

module.exports = enrutador;