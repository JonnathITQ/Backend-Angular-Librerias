'use strict';
var Usuario = require('../models/usuarios');

var controller = {

    estadisticasUsuarios: async function (req, res) {
        try {
            // Traemos todos los usuarios a travez del sort
            var usuarios = await Usuario.find({}).sort('apellido');

            // Cantidad total de usuarios
            var total = usuarios.length;

            return res.status(200).send({
                totalUsuarios: total,
                usuarios: usuarios
            });

        } catch (err) {
            console.error('Error al obtener estadísticas de usuarios', err);
            return res.status(500).send({
                message: 'Error al obtener estadísticas de usuarios',
                error: err
            });
        }
    }

};

module.exports = controller;