'use strict'
var Empleados = require('../models/empleados');
var path = require('path');
var fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var controller = {
    home: function (req, res) {
        return res.status(200).send(
            "<h1> PRUEBA COMPLETADA, EMPLEADOS FUNCIONA"
        )
    },

    verEmpleados: function (req, res) {
        Empleados.find({}).sort().exec()
            .then(empleado => {
                if (!empleado || empleado.length === 0)
                    return res.status(404).send({ message: 'No se encontaron empleados' })
                return res.status(200).send({ empleado })
            })
            .catch(err => {
                return res.status(500).send({ message: 'Error al obtener datos', error: err });
            });
    },

    verEmpleado: function (req, res) {
        var empleadoId = req.params.id;

        Empleados.findById(empleadoId)
            .then(empleado => {
                if (!empleado) return res.status(404).send({ message: 'El empleado con esta ID no existe' })
                return res.status(200).send({ empleado })
            })

            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El id no es válido' });
                }
                return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
            });
    },

    guardarEmpleados: async function (req, res) {
        console.log("BODY RECIBIDO:", req.body);  // ← IMPORTANTE

        var empleado = new Empleados;
        var params = req.body;

        console.log("CONTRASEÑA ORIGINAL:", params.contrasenia); // ← IMPORTANTE

        empleado.nombre = params.nombre;
        empleado.apellido = params.apellido;
        empleado.cedula = params.cedula;
        empleado.tipoSangre = params.tipoSangre;
        empleado.seguroMedico = params.seguroMedico;
        empleado.correo = params.correo;

        if (params.contrasenia) {
            empleado.contrasenia = await bcrypt.hash(params.contrasenia, 10);
        }

        console.log("HASH GENERADO:", empleado.contrasenia); // ← IMPORTANTE

        empleado.rol = params.rol;
        empleado.imagen = null;

        empleado.save()
            .then(empleadoGuardado => res.status(200).send({ empleado: empleadoGuardado }))
            .catch(err => res.status(500).send({ message: 'Error al guardar', error: err }));
    },



    actualizarEmpleados: function (req, res) {
        var empleadosId = req.params.id;
        var actualizar = req.body;

        Empleados.findByIdAndUpdate(empleadosId, actualizar, { new: true })
            .then(empleadoActualizado => {
                if (!empleadoActualizado) return res.status(404).send({ message: 'Empleado no existe, no se podrá actualizar' })
                return res.status(200).send({ empleado: empleadoActualizado });
            })

            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    deleteEmpleados: function (req, res) {
        var empleadosId = req.params.id;
        Empleados.findByIdAndDelete(empleadosId)
            .then(empleadoEliminado => {
                if (!empleadoEliminado) return res.status(400).send({ message: 'no se puede eliminar al empleado porque no existe' })
                return res.status(200).send({ empleado: empleadoEliminado, message: 'Empleado eliminado con gusto' });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El Id no es válido' })
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    cargarImagenEmpleado: function (req, res) {
        var empleadoId = req.params.id;
        var fileName = 'Imagen no cargada'

        if (req.files) {
            var filePath = req.files.imagen.path;
            var file_split = filePath.split('\\');
            var fileName = file_split[file_split.length - 1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[extSplit.length - 1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Empleados.findByIdAndUpdate(empleadoId, { imagen: fileName }, { new: true })
                    .then(empleadoActualizado => {
                        if (!empleadoActualizado) {
                            fs.unlink(filePath, (unlinkErr) => {
                                return res.status(404).send({ message: 'El usuario no existe, no se subió la imagen' })
                            });
                        } else {
                            return res.status(200).send({ empleado: empleadoActualizado });
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

    tenerImagenEmpleado: function (req, res) {
        var file = req.params.imagen;
        var path_file = path.join(__dirname, '../uploads', file);

        fs.stat(path_file, function (err, stats) {
            if (!err && stats.isFile()) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({ message: 'La imagen no existe' });
            }
        });
    },

    loginEmpleado: async function (req, res) {
        const { correo, contrasenia } = req.body;

        try {
            // Buscar empleado por correo
            const empleado = await Empleados.findOne({ correo });
            if (!empleado) {
                return res.status(400).send({ message: 'Correo no registrado' });
            }

            // Comparar contraseñas (texto plano vs hash)
            const passwordCorrecta = await bcrypt.compare(contrasenia, empleado.contrasenia);

            if (!passwordCorrecta) {
                return res.status(400).send({ message: 'Contraseña incorrecta' });
            }

            // Generar token JWT
            const token = jwt.sign(
                {
                    id: empleado._id,
                    correo: empleado.correo,
                    rol: empleado.rol
                },
                "adriel",
                { expiresIn: "4h" }
            );

            return res.status(200).send({
                message: "login exitoso",
                token,
                empleado
            });

        } catch (error) {
            console.error("ERROR LOGIN:", error);
            return res.status(500).send({ message: "Error en login", error });
        }
    }


}

module.exports = controller;