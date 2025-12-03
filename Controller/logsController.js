'use strict'
var Logs = require('../models/logs');
var path = require('path');


var controller = {

    verlogs: function (req, res) {

        if (!req.usuario || req.usuario.rol !=="admin"){
            return res.status(403).send({message:"No esta autorizado para ver logs"})
        }

        Logs.find({}).sort({ fecha: -1 }).populate('actor_id').exec()
            .then(logs => {
                if (!logs || logs.length === 0)
                    return res.status(404).send({ message: 'No se encontaron logs' })
                return res.status(200).send({ logs })
            })
            .catch(err => {
                return res.status(500).send({ message: 'Error al obtener logs', error: err });
            });
    },

    verlog: function (req, res) {
        var logId = req.params.id;

        if (!req.usuario || req.usuario.rol !=="admin"){
            return res.status(403).send({message:"No esta autorizado para ver este log"})
        }

        Logs.findById(logId).populate('actor_id')
            .then(log => {
                if (!log) return res.status(404).send({ message: 'El log con esta ID no existe' })
                return res.status(200).send({ log })
            })

            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El id no es válido' });
                }
                return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
            });
    },

    guardarLogs: function (req, res) {
        var log = new Logs();
        var params = req.body;

        //Aquí voy asignar los datos
        log.actor_id = params.actor_id;
        log.actor_tipo = params.actor_tipo;
        log.accion = params.accion;
        log.recurso = params.recurso
        log.recurso_id = params.recurso_id;
        log.descripcion = params.descripcion

        log.save()
            .then(logGuardar => {
                if (!logGuardar)
                    return res.status(400).send({ message: 'No se pudo guardar el log' });
                //Tenemos que mostrar mediante el id para poder asignar el populate
                return Logs.findById(logGuardar._id)
                    .populate('actor_id')
                    .then(logCompleto => {
                        return res.status(200).send({ log: logCompleto });
                    });
            })
            .catch(err => {
                return res.status(500).send({ message: 'No se pudieron guardar los logs', error: err });
            });
    },

}
module.exports = controller;