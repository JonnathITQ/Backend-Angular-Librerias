'use strict' //previene: variables globales, lanza errores y no los silencia, restringe comportamientos poco seguros

//Variables para traer los datos
var Empleados = require('../models/empleados');//Traemos el modelo de empleados
var path = require('path');// traemos el path para navegar y resolver rutas de archivos 
var fs = require('fs'); // traemos el file system, lee , escribe, borra archivos
const bcrypt = require('bcryptjs'); // traemos el bycript para hashear las contraseñas
const jwt = require('jsonwebtoken'); //Autenticación por JWT

var controller = { //Variable donde pondremos la lógica de los métodos

    //Primer método, este será de prueba para ver si recibe los endpoints la API
    home: function (req, res) {
        return res.status(200).send(
            "<h1> PRUEBA COMPLETADA, EMPLEADOS FUNCIONA"
        )
    },

    //Segundo método, ver la lista de empleados
    verEmpleados: function (req, res) {
        //El find es para buscar todos los registros de la colección "empleados"
        //El sort ordena los resultados
        //y el exec ejecuta y devuelve una promesa de JS
        Empleados.find({}).sort().exec()
            .then(empleado => { //Hace un callback de una respuesta exitosa
                if (!empleado || empleado.length === 0)//Verifica si no se encontraron empleados
                    return res.status(404).send({ message: 'No se encontaron empleados' }) //Si lo encontró, devuelve un error 404
                return res.status(200).send({ empleado }) // si no lo encontró, devolverá la lista de empleados
            })
            .catch(err => { //manejo de errores
                return res.status(500).send({ message: 'Error al obtener datos', error: err }); //error interno del servidor (algo hice mal en el code si sale este error)
            });
    },

    //Tercer método, obtener el empleado por id (basicamente para un filtro)
    verEmpleado: function (req, res) {
        var empleadoId = req.params.id; //obtiene el id del empleado desde los parámetros de la URL gracias al "req.params"

        Empleados.findById(empleadoId) // Busca en la colección de Empleados un archivo cuyo _id con el empleadoId
            .then(empleado => { //Callback de una respuesta exitosa
                if (!empleado) return res.status(404).send({ message: 'El empleado con esta ID no existe' }) //Si el id del empleado no existe
                return res.status(200).send({ empleado }) //Si existe, devuelve el empleado en específico
            })

            .catch(err => { //captura el error al consultar en la base de datos
                if (err.name === 'CastError') { //El castError pasa cuando el ID no es válido para MongoDB
                    return res.status(404).send({ message: 'El id no es válido' }); //Mensaje con un 404
                }
                return res.status(500).send({ message: 'Error al recuperar los datos', error: err }); //Error interno del servidor
            });
    },

    //Cuarto método, guardar empleados
    //Función asíncrona debido a que al hashear con bycrypt es un proceso asíncrono y ambos deben ser compatibles
    guardarEmpleados: async function (req, res) {
        var empleado = new Empleados;//Instanciamos el modelo "Empleados"
        var params = req.body; //Obtendrá los datos enviados por el cliente desde la petición

        empleado.nombre = params.nombre; //asigna el nombre del empleado
        empleado.apellido = params.apellido; //asigna el apellido del empleado
        empleado.cedula = params.cedula;//asigna la cédula del empleado
        empleado.tipoSangre = params.tipoSangre;//asigna el tipo de sangre del empleado
        empleado.seguroMedico = params.seguroMedico;//asigna si tiene seguro médico o no del empleado
        empleado.correo = params.correo;//asigna el correo del empleado

        if (params.contrasenia) { //Este if será para verificar si en la petición se envió una contraseña
            empleado.contrasenia = await bcrypt.hash(params.contrasenia, 10); //Encripta la contraseña con bycrypt usando 10 salt rounds
        }

        empleado.rol = params.rol; //Asignamos el rol
        empleado.imagen = null; //Inicializamos el campo de imagen en null porque le agregaremos después cuando el usuario esté creado

        empleado.save() //Guarda el nuevo doc en la base de datos
            .then(empleadoGuardado => res.status(200).send({ empleado: empleadoGuardado })) //si se guarda bien, dará un code 200 y devolverá el empleado guardado
            .catch(err => res.status(500).send({ message: 'Error al guardar', error: err })); //error de código interno
    },


    //Quinto método: Actualizar al empleado
    actualizarEmpleados: function (req, res) {
        var empleadosId = req.params.id; //Obtiene el ID del empleado desde los params, es decir, los parametros de la url
        var actualizar = req.body; //Obtiene los datos del cliente para poder actualizar

        //1) Buscará el ID del empleado y actualiza sus campos con los datos del body
        //2) el {new:true} hace que devuelva el empleado ya actualizado, reemplazando al anterior
        Empleados.findByIdAndUpdate(empleadosId, actualizar, { new: true })
            .then(empleadoActualizado => {
                //Si no se encuentra empleado, error 404
                if (!empleadoActualizado) return res.status(404).send({ message: 'Empleado no existe, no se podrá actualizar' })
                //Si lo hace, devolverá el empleado actualizado con el code 200
                return res.status(200).send({ empleado: empleadoActualizado });
            })

            .catch(err => { //Manejo de errores
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' }); //Si el ID es inválido
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err }); //Si la lógica tiene errores
            });
    },

    //Sexto método: Borrar usuario
    deleteEmpleados: function (req, res) {
        //Obtiene el id desde los parámetros de la URL
        var empleadosId = req.params.id;
        Empleados.findByIdAndDelete(empleadosId) //Busca los elementos por el ID y los elimina de la colección
            //Si se pudo realizar correctamente, entonces
            .then(empleadoEliminado => {
                //Si no se encuentra el empleado, devuelve que no se podrá eliminar
                if (!empleadoEliminado) return res.status(400).send({ message: 'no se puede eliminar al empleado porque no existe' })
                //Si se encontró, devuelve al usuario eliminado y un mensaje
                return res.status(200).send({ empleado: empleadoEliminado, message: 'Empleado eliminado con gusto' });
            })
            .catch(err => { //Manejo de errores
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El Id no es válido' }) //Si el ID no es válido
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err }); //Si hay algún error de lógica en el servidor
            });
    },

    //Septimo método: Para que empleado pueda subir una imagen
    cargarImagenEmpleado: function (req, res) {
        var empleadoId = req.params.id; //Obtiene el id del empleado desde la URL
        var fileName = 'Imagen no cargada' //Valor por default que le ponemos a la carpeta (en esa cosa de abajo donde dice que no tienes imagen, eso)

        if (req.files) { //Esto va a verificar si la petición que hacemos tiene archivos
            var filePath = req.files.imagen.path; //Luego obtendrá la ruta completa del archivo subido de forma temporal
            var file_split = filePath.split('\\'); //Divide las barras invertidas para obtener el nombre del archivo
            var fileName = file_split[file_split.length - 1]; //toma la última parte del path (el nombre del archivo)

            var extSplit = fileName.split('\.'); //Separa el nombre por el . para obtener la extensión, es decir, nombre.extension
            var fileExt = extSplit[extSplit.length - 1]; //Obtiene la extensión del archivo

            //Ponemos extensiones válidas y cómunes de los archivos (imagenes)
            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                //Si la extensión es válida, se actualiza el campo "imagen" del empleado con el nombre del archivo (nombre.extensión)
                //Con el {new: true} hace que retorne el empleado ya actualizado
                Empleados.findByIdAndUpdate(empleadoId, { imagen: fileName }, { new: true })
                    .then(empleadoActualizado => { //Si todo se ejecuta correctamente
                        if (!empleadoActualizado) { //Si no existe el id del empleado
                            fs.unlink(filePath, (unlinkErr) => { //borra la imagen del servidor porque no será usada
                                return res.status(404).send({ message: 'El usuario no existe, no se subió la imagen' }) //Regresa un mensaje que no existe el usuario
                            });
                        } else {
                            return res.status(200).send({ empleado: empleadoActualizado }); //si no es el caso, retorna el usuario ya con la imagen
                        }
                    })
                    .catch(err => { //Validación de errores
                        fs.unlink(filePath, (unlinkErr) => { //Se limpia borrando los archivos temporales
                            if (unlinkErr) console.error('Error al eliminar el archivo temporal', unlinkErr); //error si no se puede borrar el temporal
                            if (err.name === 'CastError') {
                                return res.status(404).send({ message: 'El Id no es válido' }) //Error si el ID no es válido
                            }
                            return res.status(500).send({ message: 'Error al recuperar datos', error: err }); //Error si hay falla en la lógica
                        });
                    });
            } else {
                fs.unlink(filePath, (err) => { //Si la imágen no es válida por extensión, es decir, si no es png, jpg, jpeg o gif
                    if (err) console.error('Error al eliminar el archivo con ext no válida', err) //Error donde dice que la ext no es válida
                    return res.status(200).send({ message: "La extensión no es válida, archivo eliminado" }); //Regresará un mensaje donde diga que la extensión no es válida
                });
            }
        } else { //Si no se mandó ningún archivo en la petición
            return res.status(400).send({ message: 'No se subió ninguna imagen' })
        }
    },

    //Octavo método: Obtener y mostrar la imágen guardada
    tenerImagenEmpleado: function (req, res) {
        var file = req.params.imagen; //Obtiene el nombre del archivo según la url
        var path_file = path.join(__dirname, '../uploads', file); //construye la ruta del archivo dentro de la carpeta uploads

        //el fs.stat verifica si el archivo existe y obtiene la información de el
        fs.stat(path_file, function (err, stats) {
            if (!err && stats.isFile()) {//Si no hay error y el documento del archivo es real
                return res.sendFile(path.resolve(path_file)); //Mostrará la imagen al cliente gracias al sendFile
            } else {
                return res.status(404).send({ message: 'La imagen no existe' }); //Si no es el caso, responde con un 404 que es "no encontrado"
            }
        });
    },

    loginEmpleado: async function (req, res) { //Método asíncrono para iniciar sesión (para el hash y comparación)
        const { correo, contrasenia } = req.body; //constante para extraer el correo y contraseña enviados por el cliente

        try {
            // Buscar empleado por correo
            const empleado = await Empleados.findOne({ correo }); //Busca en la BDD un empleado cuyo nombre coincida con el que puso
            if (!empleado) {
                return res.status(400).send({ message: 'Correo no registrado' }); //Si no hay, saldrá correo no registrado
            }

            // Comparar contraseñas (texto plano vs hash)
            //bcrypt.compare verifica que la contraseña ingresada coincida con el hash guardado
            const passwordCorrecta = await bcrypt.compare(contrasenia, empleado.contrasenia);

            if (!passwordCorrecta) { //Si al comparar las contraseñas no coinciden
                return res.status(400).send({ message: 'Contraseña incorrecta' }); //saldrá error 400 donde la contraseña será incorrecta
            }

            // Generar token JWT
            const token = jwt.sign(
                {
                    id: empleado._id, //Datos que irán dentro del token
                    correo: empleado.correo,
                    rol: empleado.rol
                },
                "adriel", //Es la clave donde el middleware va a requerir con firma el token
                { expiresIn: "4h" } //Tiempo que expira el token
            );

            //Si todo sale bien
            return res.status(200).send({ //Código exitoso
                message: "login exitoso", //Mensaje
                token, //Token
                empleado //JSON de empleado
            });

            //Si no sale bien
        } catch (error) { //Manejo de errores
            console.error("ERROR LOGIN:", error); //Devolverá el error en la consola
            return res.status(500).send({ message: "Error en login", error }); //Error en la lógica
        }
    }


}

module.exports = controller;