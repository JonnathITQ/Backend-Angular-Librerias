'use strict'

var Usuarios = require('../models/usuarios');
var path = require('path');
var fs = require('fs');

var controller = {

    home: (req, res) => res.status(200).send("<h1>Home Empleado</h1>"),

    verUsuarios: function (req, res) {
        Usuarios.find({}).sort().exec()
            .then(usuario => {
                if (!usuario || usuario.length === 0)
                    return res.status(404).send({ message: 'No se encontaron usuarios' })
                return res.status(200).send({ usuario })
            })
            .catch(err => {
                return res.status(500).send({ message: 'Error al obtener datos', error: err });
            });
    },

    verUsuario: function (req, res) {
        var usuarioId = req.params.id;

        Usuarios.findById(usuarioId)
            .then(usuario => {
                if (!usuario) return res.status(404).send({ message: 'El usuario con esta ID no existe' })
                return res.status(200).send({ usuario })
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El id no es válido' });
                }
                return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
            });
    },

    guardarUsuarios: function (req, res) {
        var usuario = new Usuarios;
        var params = req.body;

        usuario.nombre = params.nombre;
        usuario.apellido = params.apellido;
        usuario.cedula = params.cedula;
        usuario.correo = params.correo;
        usuario.contrasenia = params.contrasenia;
        usuario.imagen = null;

        usuario.save()
            .then(usuarioGuardado => {
                if (!usuarioGuardado) return res.status(404).send({ message: 'No se ha guardado el usuario' })
                return res.status(200).send({ usuario: usuarioGuardado });
            })
            .catch(err => {
                return res.status(500).send({ message: 'Error al guardar', error: err });
            });
    },

    actualizarUsuario: function (req, res) {
        var usuariosId = req.params.id
        var actualizar = req.body;

        Usuarios.findByIdAndUpdate(usuariosId, actualizar, { new: true })
            .then(usuarioActualizado => {
                if (!usuarioActualizado) return res.status(404).send({ message: 'El usuario no existe, no se podrá actualizar' })
                return res.status(200).send({ usuario: usuarioActualizado });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    deleteUsuarios: function (req, res) {
        var usuarioId = req.params.id;
        Usuarios.findByIdAndDelete(usuarioId)
            .then(usuarioEliminado => {
                if (!usuarioEliminado) return res.status(400).send({ message: 'no se puede eliminar un usuario que no existe' });
                return res.status(200).send({ usuario: usuarioEliminado, message: 'Usuario eliminado con satisfacción' })
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El Id no es válido' })
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    cargarImagenUsuario: function (req, res) {
        var usuarioId = req.params.id;
        var fileName = 'Imagen no subida'

        if (req.files) {
            var filePath = req.files.imagen.path;
            var file_split = filePath.split('\\');
            var fileName = file_split[file_split.length - 1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[extSplit.length - 1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Usuarios.findByIdAndUpdate(usuarioId, { imagen: fileName }, { new: true })
                    .then(usuarioActualizado => {
                        if (!usuarioActualizado) {
                            fs.unlink(filePath, (unlinkErr) => {
                                return res.status(404).send({ message: 'El usuario no existe, no se subió la imagen' });
                            });
                        } else {
                            return res.status(200).send({ usuario: usuarioActualizado });
                        }
                    })

                    .catch(err => {
                        fs.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) console.error('Error al eliminar el archivo temporal', unlinkErr);
                            if (err.name === 'CastError') {
                                return res.status(404).send({ message: 'El Id no es válido' })
                            }
                            return res.status(500).send({ message: 'Error al recuperar datos', error: err });
                        });
                    });
            } else {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error al eliminar el archivo con ext no válida', err)
                    return res.status(200).send({ message: "La extensión no es válida, archivo eliminado" });
                });
            }
        } else {
            return res.status(400).send({ message: 'No se subió ninguna imagen' })
        }
    },

    tenerImagenUsuario: function (req,res) {
        var file = req.params.imagen;
        var path_file = path.join(__dirname, '../uploads', file);

        fs.stat(path_file, function (err, stats) {
            if (!err && stats.isFile()) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({ message: 'La imagen no existe' });
            }
        });
    }
}

module.exports = controller