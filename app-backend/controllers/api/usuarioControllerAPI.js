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
        nombre: req.body.nombre + " " + req.body.apellido, 
        email: req.body.email, 
        cohorte: req.body.cohorte,
        password: req.body.password,
        ubicacion: [req.body.lat, req.body.lng]
    })
    usuarios.save()
    .then((r) => {
        usuarios.enviar_email_bienvenida()
        res.status(200).json({message: "Usuario creado con exito", creation: true})
    })
    .catch((err) => {
        res.json({message: err.message, creation: false})
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

