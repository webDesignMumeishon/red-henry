let Usuario = require('../models/usuario')


module.exports = {

    list: function (req, res){
        Usuario.find({}).then( usuarios => {
            res.render('usuarios/index', {usuarios: usuarios})
        })
    },

    update_get: function(req, res, next){
        Usuario.findById(req.params.id)
        .then(usuario => {
            res.render('usuarios/update', {errors:{}, usuario: usuario})
        })
    },

    update: function(req, res, next){
        let update_values = {nombre: req.body.nombre}
        Usuario.findByIdAndUpdate(req.params.id, update_values)
        .then(usuario => {
            res.redirect('/usuarios')
            return
        })
        .catch(err => {
            console.log(err)
            res.render('usuarios/update', {errors: err.errors, usuario: new Usuario({nombre: req.body.nombre, email:req.body.email})})
        })
    },

    create_get: function (req, res, next){
        res.render('usuarios/create', {errors:{}, usuario: new Usuario()})
    },

    create: function (req, res, next){
        if(req.body.password != req.body.confirm_password){
            res.render('usuarios/create', {errors: {confirm_password: {message: 'No coincide con el password ingresado'}}})
            return
        }
        console.log(req.body)
        Usuario.create({
            nombre: req.body.nombre,
            email: req.body.email,
            cohorte: req.body.cohorte,
            password: req.body.password,
            ubicacion: [req.body.lat, req.body.lng]
        })
        .then( nuevoUsuario => {
            nuevoUsuario.enviar_email_bienvenida()
            res.redirect('/usuarios')
        })
        .catch(err => {
            console.log(err)
            res.render('usuarios/create', {errors: err.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email})});
        })
    },
    delete: function(req, res, next){
        Usuario.findByIdAndDelete(req.body.id)
        .then( () => {
            res.redirect('/usuarios');
        })
        .catch( err => {
            next(err);

        })
    },
}