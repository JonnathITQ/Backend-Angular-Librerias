'use strict'

var express = require('express');
var router = express.Router();
var usuariosController = require('../Controller/usuariosController');
var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });

//Lista de usuarios
router.get('/usuarios', usuariosController.verUsuarios);
//Ver usuario por id (usuario específico)
router.get('/usuario/:id', usuariosController.verUsuario);
//Post para poder guardar el usuario
router.post('/guardar-usuarios', usuariosController.guardarUsuarios);
//Actualizar usuario
router.put('/usuario/:id', usuariosController.actualizarUsuario);
//Borrar usuario
router.delete('/usuario/:id', usuariosController.deleteUsuarios);
//Cargar la imagen para el usuario (subir la imagen)
router.post('/cargar-imagenUsuario/:id', multiPartyMiddleware, usuariosController.cargarImagenUsuario);
//Visualizar la imagen del usuario
router.get('/tener-imagenUsuario/:imagen', usuariosController.tenerImagenUsuario);
//Login para el usuario
router.post('/login-usuario', usuariosController.loginUsuario);
//recuperar la contraseña
router.post('/recuperar-contrasenia', usuariosController.recuperarContrasenia);

module.exports = router;