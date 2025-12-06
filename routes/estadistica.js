var express=require('express');
var enrutador = express.Router();
var estadisticaController=require('../Controller/estadisticaController');
var auth = require('../middlewares/auth');


enrutador.get('/usuarios-estadistica', auth, estadisticaController.estadisticaLibrospapa);

enrutador.get('/librosFavoritos-estadistica', auth, estadisticaController.librosFavoritos);

module.exports = enrutador;