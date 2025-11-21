'use strict'
var mongoose= require('mongoose');
var Schema = mongoose.Schema;

var UsuariosSchema= Schema({
    nombre: String,
    apellido: String,
    cedula : String,
    correo : String,
    contrasenia: String,
    rol : String
});

module.exports = mongoose.model('Usuarios' , UsuariosSchema)