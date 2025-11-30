'use strict'

var express = require('express');
var router = express.Router();
var usuariosController = require('../Controller/usuariosController');
var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });

router.get('/usuarios', usuariosController.verUsuarios);
router.get('/usuario/:id', usuariosController.verUsuario);
router.post('/guardar-usuarios', usuariosController.guardarUsuarios);
router.put('/usuario/:id', usuariosController.actualizarUsuario);
router.delete('/usuario/:id', usuariosController.deleteUsuarios);
router.post('/cargar-imagenUsuario/:id', multiPartyMiddleware, usuariosController.cargarImagenUsuario);
router.get('/tener-imagenUsuario/:imagen', usuariosController.tenerImagenUsuario);

router.post('/login-usuario', usuariosController.loginUsuario);
router.post('/recuperar-contrasenia', usuariosController.recuperarContrasenia);

module.exports = router;