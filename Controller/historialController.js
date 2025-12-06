'use strict'

var Historial = require('../models/historial.js');

var controller = {

    agregarHistorial: function (req, res) {
        var params = req.body;
        var historial = new Historial();

        if (params.usuario && params.libro) {
            historial.usuario = params.usuario;
            historial.libro = params.libro;

            /*
            Comprueba si la entrada ya existe para evitar duplicados (opcional, pero útil para el historial).
            O simplemente añade siempre una nueva entrada para «visto a las X horas».
            */

            Historial.findOne({ usuario: historial.usuario, libro: historial.libro })
                .then(existing => {
                    if (existing) {
                        // Update date
                        existing.fecha = Date.now();
                        return existing.save();
                    } else {
                        return historial.save();
                    }
                })
                .then(historialGuardado => {
                    return res.status(200).send({ historial: historialGuardado });
                })
                .catch(err => {
                    return res.status(500).send({ message: 'Error al guardar en historial', error: err });
                });

        } else {
            return res.status(400).send({ message: 'Faltan datos (usuario o libro)' });
        }
    },

    verHistorialUsuario: function (req, res) {
        var usuarioId = req.params.idUsuario;

        Historial.find({ usuario: usuarioId })
            .populate('libro')
            .sort({ fecha: -1 }) // la más reciente primero
            .exec()
            .then(historial => {
                if (!historial) return res.status(404).send({ message: 'No hay historial' });
                return res.status(200).send({ historial });
            })
            .catch(err => {
                return res.status(500).send({ message: 'Error al recuperar historial', error: err });
            });
    }
};

module.exports = controller;