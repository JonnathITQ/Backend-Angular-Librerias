'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistorialSchema = Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios', required: true },
    libro: { type: Schema.Types.ObjectId, ref: 'Libros', required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Historial', HistorialSchema);
