var express=require('express');
var enrutador = express.Router();
var estadisticaController=require('../Controller/estadisticaController');
var auth = require('../middlewares/auth');


enrutador.get('/usuarios-estadistica', auth, estadisticaController.estadisticasUsuarios);

module.exports = enrutador;