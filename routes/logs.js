'use strict'

var express = require('express');
var LogsControllers = require('../Controller/logsController');
var auth=require('../middlewares/auth');
var enrutador = express.Router();


//Endpoints

//Ver todos los logs que existan por parte del bibliotecario
enrutador.get('/logs', auth, LogsControllers.verlogs);

enrutador.get('/logs/:id', auth, LogsControllers.verlog);

enrutador.post('/logs', auth, LogsControllers.guardarLogs);


module.exports = enrutador;

