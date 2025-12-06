'use strict'

var express = require('express');
var TicketController = require('../Controller/ticketsController');

var enrutador = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });

//guardar ticket
enrutador.post('/save-ticket', TicketController.saveTicket);
//mostrar la lista de tickets
enrutador.get('/tickets', TicketController.getTickets);
//actualizar los tickets
enrutador.put('/ticket/:id', TicketController.updateTicket);
//borrar los tickets
enrutador.delete('/ticket/:id', TicketController.deleteTicket);
//Subir la imagen en el formulario de contacto
enrutador.post('/upload-image-ticket/:id', multipartMiddleware, TicketController.uploadImage);
//Ver la imagen del ticket
enrutador.get('/get-image-ticket/:image', TicketController.getImageFile);

module.exports = enrutador;