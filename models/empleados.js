'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpleadoSchema = Schema({
    nombre: String,
    apellido: String,
    cedula: Number,
    tipoSangre: String,
    seguroMedico: String,
    correo: String,
    contrasenia: String,
    rol: String,
    imagen: String
});

module.exports= mongoose.model('Empleados', EmpleadoSchema)