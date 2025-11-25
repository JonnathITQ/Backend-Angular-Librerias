'use strict'
var Libros = require('../models/libros');
var path = require('path');
var fs = require('fs');

var controller = {

    test: function (req, res) {
        return res.status(200).send(
            "<h1>PRUEBA COMPLETADA, SI FUNCIONA</h1>"
        )
    },

    guardarLibros: function (req, res) {
        var libro = new Libros;
        var params = req.body;

        libro.titulo = params.titulo;
        libro.descripcion = params.descripcion;
        libro.genero = params.genero;
        libro.portada = null;
        libro.anio_publicacion = params.anio_publicacion;
        libro.idioma = params.idioma;
        libro.cantidad_disponible = params.cantidad_disponible;
        libro.autor = params.autor;
        libro.ubicacion = params.ubicacion

        libro.save()
            .then(libroAlmacenado => {
                if (!libroAlmacenado) return res.status(404).send({ message: 'No se ha guardado el libro' })
                return res.status(200).send({ libro: libroAlmacenado });
            })
            .catch(err => {
                return res.status(500).send({ message: 'error al guardar', error: err });
            });
    },

    verLibros: function (req, res) {
        Libros.find({}).sort().exec()
            .then(libro => {
                if (!libro || libro.length === 0)
                    return res.status(404).send({ message: 'No hay libros que mostrar' });
                return res.status(200).send({ libro });
            })
            .catch(err => {
                return res.status(500).send({ message: 'Error al obtener los datos', error: err });
            });
    },

    verLibro: function (req, res) {
        var libroId = req.params.id;

        Libros.findById(libroId)
            .then(libro => {
                if (!libro) return res.status(404).send({ message: 'El producto con esta ID no existe' })
                return res.status(200).send({ libro })
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    borrarLibros:function(req,res){
        var libroId = req.params.id
        Libros.findByIdAndDelete(libroId)
        .then(libroRetirado=>{
            if(!libroRetirado)
                return res.status(400).send({message:'No se puede borrar un libro que no tenemos'});
            return res.status(200).send({libro:libroRetirado, message:'Producto eliminado correctamente'});
        })
        .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    actualizarLibros:function(req,res){
        var libroId = req.params.id
        var actualizar = req.body;

        Libros.findByIdAndUpdate(libroId, actualizar, {new: true})
        .then(libroActualizado=>{
            if(!libroActualizado)
                return res.status(404).send({message: 'El libro no existe, no se puede actualizar'});
            return res.status(200).send({libro:libroActualizado});
        })
        .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    cargarPortada:function(req,res){
        var libroId = req.params.id;
        var fileName= 'Imagen no subida'

        if(req.files){
            var filePath = req.files.portada.path;
            var file_split= filePath.split('\\');
            var fileName = file_split[file_split.length - 1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[extSplit.length - 1];

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                Libros.findByIdAndUpdate(libroId, {portada:fileName}, {new: true})
                .then(libroActualizado=>{
                    if(!libroActualizado){
                        fs.unlink(filePath, (unlinkErr)=>{
                            return res.status(404).send({message: 'El producto no existe, no se subió la imagen'});
                        });

                    } else {
                        return res.status(200).send({libro: libroActualizado});
                    }
                })
                .catch(err=>{
                    fs.unlink(filePath, (unlinkErr)=>{
                        if (unlinkErr) console.error('Error al eliminar el archivo temporal', unlinkErr);
                        if(err.name === 'CastError'){
                            return res.status(404).send({message: 'Formato Id no válido para este campo'})
                        }
                        return res.status(500).send({message: 'Error al subir la imagen o actualizar'})
                    });
                });
            } else {
                fs.unlink(filePath,(err)=>{
                    if (err) console.error('Error al eliminar el archivo con ext no válida', err)
                    return res.status(200).send({message: "La extensión no es válida, archivo eliminado"});
                });
            }
        } else {
            return res.status(400).send({message: 'No se subió ninguna imágen'});
        }
    },

    tenerPortada: function(req, res) {
        var file = req.params.portada;
        //debes usar path.join y asegurarte de que la ruta sea relativa al archivo, no solo './uploads/'.
        var path_file = path.join(__dirname, '../uploads', file);

        fs.stat(path_file, function(err, stats) {
            if (!err && stats.isFile()) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({ message: 'La imagen no existe' });
            }
        });
    }
}

module.exports = controller;