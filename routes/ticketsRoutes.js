'use strict'

var express = require('express');
var TicketController = require('../Controller/ticketsController');

var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });

//guardar ticket
router.post('/save-ticket', TicketController.saveTicket);
//mostrar la lista de tickets
router.get('/tickets', TicketController.getTickets);
//actualizar los tickets
router.put('/ticket/:id', TicketController.updateTicket);
//borrar los tickets
router.delete('/ticket/:id', TicketController.deleteTicket);
//Subir la imagen en el formulario de contacto
router.post('/upload-image-ticket/:id', multipartMiddleware, TicketController.uploadImage);
//Ver la imagen del ticket
router.get('/get-image-ticket/:image', TicketController.getImageFile);

module.exports = router;
