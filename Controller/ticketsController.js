'use strict'

var Ticket = require('../models/tickets');
var fs = require('fs');
var path = require('path');

var controller = {
    // Guardar un nuevo ticket
    saveTicket: function (req, res) {
        var params = req.body;
        var ticket = new Ticket();

        if (params.nombre && params.email && params.asunto && params.mensaje) {
            ticket.nombre = params.nombre;
            ticket.email = params.email;
            ticket.asunto = params.asunto;
            ticket.mensaje = params.mensaje;
            ticket.estado = false;
            ticket.image = null;

            ticket.save()
                .then((ticketStored) => {
                    if (!ticketStored) {
                        return res.status(404).send({ message: 'No se ha podido guardar el ticket' });
                    }
                    return res.status(200).send({ ticket: ticketStored });
                })
                .catch((err) => {
                    return res.status(500).send({ message: 'Error al guardar el documento' });
                });
        } else {
            return res.status(200).send({ message: 'Todos los campos son obligatorios' });
        }
    },

    // Obtener todos los tickets
    getTickets: function (req, res) {
        Ticket.find({}).sort('-fecha')
            .then((tickets) => {
                if (!tickets) {
                    return res.status(404).send({ message: 'No hay tickets para mostrar' });
                }
                return res.status(200).send({ tickets });
            })
            .catch((err) => {
                return res.status(500).send({ message: 'Error al devolver los datos' });
            });
    },

    // Actualizar estado del ticket
    updateTicket: function (req, res) {
        var ticketId = req.params.id;
        var update = req.body;

        Ticket.findByIdAndUpdate(ticketId, update, { new: true })
            .then((ticketUpdated) => {
                if (!ticketUpdated) {
                    return res.status(404).send({ message: 'No existe el ticket para actualizar' });
                }
                return res.status(200).send({ ticket: ticketUpdated });
            })
            .catch((err) => {
                return res.status(500).send({ message: 'Error al actualizar' });
            });
    },

    // Eliminar ticket
    deleteTicket: function (req, res) {
        var ticketId = req.params.id;

        Ticket.findByIdAndDelete(ticketId)
            .then((ticketRemoved) => {
                if (!ticketRemoved) {
                    return res.status(404).send({ message: 'No se puede eliminar el ticket' });
                }
                return res.status(200).send({ ticket: ticketRemoved });
            })
            .catch((err) => {
                return res.status(500).send({ message: 'Error al eliminar' });
            });
    },

    // Subir imagen
    uploadImage: function (req, res) {
        var ticketId = req.params.id;
        var fileName = 'Imagen no subida...';

        if (req.files) {
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[fileSplit.length - 1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Ticket.findByIdAndUpdate(ticketId, { image: fileName }, { new: true })
                    .then((ticketUpdated) => {
                        if (!ticketUpdated) {
                            return res.status(404).send({ message: 'El ticket no existe y no se subió la imagen' });
                        }
                        return res.status(200).send({ ticket: ticketUpdated });
                    })
                    .catch((err) => {
                        return res.status(500).send({ message: 'La imagen no se ha subido' });
                    });
            } else {
                fs.unlink(filePath, (err) => {
                    return res.status(200).send({ message: 'La extensión no es válida' });
                });
            }
        } else {
            return res.status(200).send({ message: 'No has subido ninguna imagen' });
        }
    },

    // Obtener imagen
    getImageFile: function (req, res) {
        var file = req.params.image;
        var path_file = './uploads/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(200).send({ message: 'No existe la imagen...' });
            }
        });
    }
};

module.exports = controller;
