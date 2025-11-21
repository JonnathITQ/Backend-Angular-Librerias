'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LibrosSchema = Schema({
    titulo: String,
    descripcion : String,
    genero: String,
    portada: String,
    anio_publicacion: Number,
    idioma: String,
    cantidad_disponible: Number
});

module.exports = mongoose.model('Libros', LibrosSchema);