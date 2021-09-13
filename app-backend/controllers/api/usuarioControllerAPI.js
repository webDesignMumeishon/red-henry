let Usuario = require('../../models/usuario')

exports.usuario_list = function(req, res){
    Usuario.find({})
    .then(usuarios => {
        res.status(200).json({
            usuarios: usuarios
        })
    })
}

exports.usuario_create = function(req, res){
    let usuarios = new Usuario({
        nombre: req.body.nombre, 
        email: req.body.email, 
        password: req.body.password
    })

    usuarios.save()
    .then(result => {
        res.status(200).json(result)
    })
}

exports.usuario_reservar = function(req, res){
    Usuario.findById(req.body.id)
    .then(usuario => {
        console.log(usuario)
        return usuario.reservar(req.body.bidi_id, req.body.desde, req.body.hasta)
    })
    .then(() => {
        console.log("reserva!!!!")
        res.status(200).send()
    })
}

