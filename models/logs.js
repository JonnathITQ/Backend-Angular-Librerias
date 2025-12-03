var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema= Schema({
    //Quien hizo la accion, admin o empleado
    actor_id: { type: Schema.Types.ObjectId, refPath:"actor_tipo"},
    //Definir quien lo hizo en el controlador
    actor_tipo: {type:String, enum:['Empleados']},
    //Que hizo
    accion: String,   
    //Sobre que recuros lo hizo
    recurso:  String, 
    //id del recurso hecho, puede ser libro, prestamo, etc
    recurso_id:{type: Schema.Types.ObjectId},
    descripcion: String ,
    //Fecha actual
    fecha: {
        type: Date,
        default: Date.now   
    }});

module.exports = mongoose.model('Logs', logSchema);