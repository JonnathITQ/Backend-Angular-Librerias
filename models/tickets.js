'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TicketSchema = Schema({
    nombre: String,
    email: String,
    asunto: String,
    mensaje: String,
    estado: { type: Boolean, default: false }, //Basicamente es para que siempre comience como falso, porque los tickets empezarán en pendiente
    fecha: { type: Date, default: Date.now }, //Para que de siempre la fecha actual en el horario del copilador
    image: String
});

module.exports = mongoose.model('Ticket', TicketSchema);