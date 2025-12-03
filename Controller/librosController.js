'use strict'
var Libros = require('../models/libros'); //Traemos el modelo
var path = require('path'); //importamos el path para trabajar con las rutas
var fs = require('fs'); //Operaciones de archivos

var controller = { //Controlador: lo exportaremos para manejar las rutas relacionadas con libros

    //Método uno: test
    test: function (req, res) {
        return res.status(200).send(
            "<h1>PRUEBA COMPLETADA, SI FUNCIONA</h1>"
        )
    },

    //Método dos: Guardar libros
    guardarLibros: function (req, res) {
        var libro = new Libros; //Traemos el modelo
        var params = req.body; //Obtiene los datos enviados en la petición, sea por un JSON o un form data

        libro.titulo = params.titulo;//Instancia el documento de lo que escribió el usuario
        libro.descripcion = params.descripcion;//Instancia la descripción de lo que escribió el usuario
        libro.genero = params.genero;//Instancia el género de lo que escribió el usuario
        libro.portada = null;//Inicia la portada en null porque la imagen se toma por separado
        libro.anio_publicacion = params.anio_publicacion;//Asignamos el año de publicación
        libro.idioma = params.idioma;//Asignamos el idioma
        libro.cantidad_disponible = params.cantidad_disponible;//Asignamos la cantidad disponible
        libro.autor = params.autor;//Asignamos el autor
        libro.ubicacion = params.ubicacion//Aisgnamos la ubicación
        libro.favorito = params.favorito //Asignamos si es o no es favorito

        libro.save()//Guarda el documento en la BDD de mongo
            .then(libroAlmacenado => {//Si la operación fue exitosa, entra en el then como documento guardado
                if (!libroAlmacenado) return res.status(404).send({ message: 'No se ha guardado el libro' })//Si no se devuelve el libro
                return res.status(200).send({ libro: libroAlmacenado });//Si se devuelve el libro recién creado
            })
            .catch(err => {//Manejo de errores de lógica
                return res.status(500).send({ message: 'error al guardar', error: err });//
            });
    },

    //Método tres: Lista de Libros
    verLibros: function (req, res) {
        Libros.find({}).sort().exec()// Busca todos los elementos del modelo Libros, 
            .then(libro => {//Si la consulta devuelve resultados entra al then
                if (!libro || libro.length === 0)//Si no hay libro o la cantidad es igual a 0
                    return res.status(404).send({ message: 'No hay libros que mostrar' });//Error 404 porque no se podrá mostrar el libro
                return res.status(200).send({ libro });//Si todo sale bien, saldrá código 200 y la lista de libros
            })
            .catch(err => {//
                return res.status(500).send({ message: 'Error al obtener los datos', error: err });//
            });
    },

    //Método cuatro: Buscar libro específico (busqueda por ID)
    verLibro: function (req, res) {
        var libroId = req.params.id;//Toma el parámetro de id de la ruta (/libro/:id)

        Libros.findById(libroId)//Busca en la colección por el id proporcionado
            .then(libro => {//Si la busqueda funciona, entonces entra en el then
                if (!libro) return res.status(404).send({ message: 'El producto con esta ID no existe' })//Si no existe
                return res.status(200).send({ libro });//Si existe, devuelve el libro específico
            })
            .catch(err => {//Manejo de errores
                if (err.name === 'CastError') {// Si el ID es inválido
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });//Error 404 ID incorrecto
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });//Error 500, error de la lógica
            });
    },

    //Quinto método: Borrar los libros seleccionados
    borrarLibros: function (req, res) {
        var libroId = req.params.id//Extrae el id desde la ruta
        Libros.findByIdAndDelete(libroId)//busca el documento por ID y lo elimina
            .then(libroRetirado => {//Si la operación funciona, entra en el then
                if (!libroRetirado)// Si el libro no fue encontrado
                    return res.status(400).send({ message: 'No se puede borrar un libro que no tenemos' });//Error 400, no fue encontrado
                return res.status(200).send({ libro: libroRetirado, message: 'Producto eliminado correctamente' });//código 200, borrado
            })
            .catch(err => {// Manejo de errores
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });//Si el ID es inválido, error 404
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });//error 500 si la lógica es incorrecta
            });
    },

    //Sexto método, Actualizar los libros
    actualizarLibros: function (req, res) {//
        var libroId = req.params.id//Extra el id del libro desde la ruta
        var actualizar = req.body;// Obtiene los atributos de la ruta

        //Actualiza el documento
        //el {new: true} hace que reemplace el documento actualizado al anterior
        Libros.findByIdAndUpdate(libroId, actualizar, { new: true })
            .then(libroActualizado => {//Si todo sale bien, entra en el then
                if (!libroActualizado)// Si no hay libro
                    return res.status(404).send({ message: 'El libro no existe, no se puede actualizar' });//Error 404, no existe libro
                return res.status(200).send({ libro: libroActualizado });//Si hay, código 200 y devolverá el libro actualizado
            })
            .catch(err => {//Manejo de errores
                if (err.name === 'CastError') {//Si el nombre es cast error, el ID será inválido
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });//error 404, ID inválido
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });//error 500, error de lógica dentro del sv
            });
    },

    //Séptimo método: Subir la imagen de la portada
    cargarPortada: function (req, res) {
        var libroId = req.params.id;// id del libro de la ruta
        var fileName = 'Imagen no subida'// mensaje default que estará al lado del botón cuando no hay imagen

        if (req.files) {
            var filePath = req.files.portada.path;//Verifica si la petición trae archivos
            var file_split = filePath.split('\\');//Divide la ruta con el / para extraer el nombre del archivo
            var fileName = file_split[file_split.length - 1];//Toma la última parte del arreglo (el nombre del archivo con la extensión)

            var extSplit = fileName.split('\.');//Divide el nombre para tener la extensión gracias al punto (nombre.ext)
            var fileExt = extSplit[extSplit.length - 1];//Extrae la extensión

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {//Extensiones válidas
                // Si la extensión es válida, intenta actualizar el documento libro con el nombre de la portada.
                Libros.findByIdAndUpdate(libroId, { portada: fileName }, { new: true })//Actualiza el campo de portada
                    .then(libroActualizado => {//Si todo sale bien, entra en el then
                        if (!libroActualizado) {//Si no existe el libro, se debe eliminar el archivo temporal para no dejar basura en el servidor.
                            fs.unlink(filePath, (unlinkErr) => {//
                                return res.status(404).send({ message: 'El producto no existe, no se subió la imagen' });//
                            });

                        } else {
                            return res.status(200).send({ libro: libroActualizado });//Si se actualizo correctamente, código 200
                        }
                    })
                    .catch(err => {//Manejo de errores
                        fs.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) console.error('Error al eliminar el archivo temporal', unlinkErr);//Si no se puede eliminar el archivo temporal
                            if (err.name === 'CastError') {//Si el ID es inválido
                                return res.status(404).send({ message: 'Formato Id no válido para este campo' })//
                            }
                            return res.status(500).send({ message: 'Error al subir la imagen o actualizar' })//Si hay errores en la lógica
                        });
                    });
            } else {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error al eliminar el archivo con ext no válida', err)//Si la extensión no es permitida
                    return res.status(200).send({ message: "La extensión no es válida, archivo eliminado" });//Borrara la imagen para no ser archivo basura dentro del servidor
                });
            }
        } else {
            return res.status(400).send({ message: 'No se subió ninguna imagen' });//Si no se sube nada, sale este error
        }
    },

    tenerPortada: function (req, res) {
        var file = req.params.portada;
        //Se debe usar path.join y asegurarte de que la ruta sea relativa al archivo, no solo './uploads/'.
        var path_file = path.join(__dirname, '../uploads', file);

        fs.stat(path_file, function (err, stats) {//
            if (!err && stats.isFile()) {//
                return res.sendFile(path.resolve(path_file));//
            } else {
                return res.status(404).send({ message: 'La imagen no existe' });//
            }
        });
    }
}

module.exports = controller;