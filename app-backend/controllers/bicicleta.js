//Desde controllers se maneja todo lo que tiene que ver con bicicletas

let Bicicleta = require('../models/bicicleta.js')

exports.bicicleta_list = function(req,res){
    //Aqui se renderiza la vista del listado de bicicletas con el objeto de Bicicleta.allBicis
    //Se hace una nueva lista. Esta es la lista de la tabla de las bicicletas
    Bicicleta.allBicis()
    .then(resultBicis => {
        console.log(resultBicis)
        res.render('bicicletas/index', {bicis: resultBicis})
    })

    //El render busca al motor de templating de vistas (pug). Dentro de views una carpeta "bicicletas" 
    //y dentro de bicicletas la vista index.pug ---------> se define una tabla
}
// |--------------------------------------------------------------------------------------------------------------|
//Tiene dos momentos la creacion de bicicletas: 
exports.bicicleta_create_get = function(req,res){
    // 1-solicitud de hacer un create que nos llega a la pag 
    res.render('bicicletas/create')
}

exports.bicicleta_create_post = function(req,res){
    // 2-confirmacion del create, atributos definidos en el formulario, creacion de la bicicleta
    let bici = Bicicleta.createInstance(req.body.code, req.body.color, req.body.modelo, [Number(req.body.lat), Number(req.body.lng)])
    Bicicleta.add(bici)
    res.redirect('/bicicletas')
}
// |--------------------------------------------------------------------------------------------------------------|
exports.bicicleta_update_get = function(req,res){
    const {code} = req.params
    Bicicleta.findByCode(code)
    .then(foundBici => {
        console.log(foundBici)
        res.render('bicicletas/update', {foundBici})
    })
}

exports.bicicleta_update_post = function(req,res){

    let {code} = req.params.code
    let update = {
        code: req.body.code,
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng]
    }

    Bicicleta.findAndUpdate(code, update)
    .then(() => {
        res.redirect('/bicicletas')
    })
}
// |--------------------------------------------------------------------------------------------------------------|
exports.bicicleta_delete_post = function (req, res){
    const {code} = req.body
    Bicicleta.removeByCode(code)
    .then(() => {res.redirect("/bicicletas")} )
}