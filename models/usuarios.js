'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuariosSchema = Schema({
    nombre: String,
    apellido: String,
    cedula: String,
    correo: String,
    contrasenia: String,
    libros_favorito: [{ type: Schema.Types.ObjectId, ref: 'Libros' }],
    historial: [{ type: Schema.Types.ObjectId, ref: 'Libros' }],
    imagen: String

});

module.exports = mongoose.model('Usuarios', UsuariosSchema)