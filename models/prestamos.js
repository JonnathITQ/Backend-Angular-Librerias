'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PrestamosSchema = Schema({

    usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
    libros_id: { type: Schema.Types.ObjectId, ref: 'Libros' },
    descripcion: String,
    horasPrestamo: Number,
    multa: Boolean

});

module.exports = mongoose.model('Prestamos', PrestamosSchema)