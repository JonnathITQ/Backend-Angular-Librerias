'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpleadoSchema = Schema({
    nombre: String,
    apellido: String,
    cedula: Number,
    tipoSangre: {type:String, enum:['A+','A-','B+','B-','AB+','AB-','O+','O-',]},
    seguroMedico: {type:String, enum:['Si','No']},
    correo: String,
    contrasenia: String,
    rol: String,
    imagen: String
});

module.exports= mongoose.model('Empleados', EmpleadoSchema)