'use strict'
var mongoose = require('mongoose'); //traemos a mongoose a la variable
var Schema = mongoose.Schema; //Creamos la variable para poder crear esquemas

var EmpleadoSchema = Schema({ //Creamos el modelo empleado
    //Atributos: tipo de dato
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

//Exportamos el módulo haciendo referencia al modelo "Empleados" y que el esquema pueda ser visible
module.exports = mongoose.model('Empleados', EmpleadoSchema)