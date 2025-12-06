'use strict';
const libros = require('../models/libros');
var Usuario = require('../models/usuarios');

var controller = {

    estadisticaLibrospapa: async function (req, res) {
        try {
            // Traemos todos los usuarios a travez del sort
            var usuarios = await Usuario.find({}).sort('apellido');

            // Cantidad total de usuarios
            var total = usuarios.length;

            return res.status(200).send({totalUsuarios: total,usuarios: usuarios});

        } catch (err) {
            return res.status(500).send({
                message: 'Error al obtener estadísticas de usuarios'});
        }
    },

    librosFavoritos: async function (req, res) {
        //Uso de aggregate para el obtener el id del libro favortio y luego indicar cuantas veces aparece cada uno
       Usuario.aggregate([
            // Se usa unwind para poder traer la info de libros como docuemntos separados
            { $unwind: '$libros_favorito' },

            // Se agrupa cada libro por su id y se suma por uno, puede leer el array porque el unwind cambio eso. 
                {
                $group: {
                    _id: '$libros_favorito',         
                    vecesFavorito: { $sum: 1 }  
                }
            },
                {
                //traer ciertos datos de libro,nombre es lo mas importante, porque se ve medio raro sin eso JAJAJ. 
                $lookup: {
                    from: 'libros',                 
                    localField: '_id',               
                    foreignField: '_id',            
                    as: 'libro'                      
                }
            },

            //Esto para traer la info de libro y cambiara a algo que el project pueda leer.
            { $unwind: '$libro' },

            // Se usa para indicar que queremos traer.
            {
                $project: {
                    _id: 0,                         
                    titulo: '$libro.titulo',        
                    vecesFavorito: 1                
                }
            },
        ])
        .then(libroFavorito => {

            if (!libroFavorito || libroFavorito.length === 0) {
                return res.status(404).send({ message: 'No hay libros marcados como favoritos' });
            }
            return res.status(200).send({libroFavorito});
        })
        .catch(err => {
            return res.status(500).send({message: 'Error al obtener estadísticas de libros favoritos'});
        });
    }
};
module.exports = controller;