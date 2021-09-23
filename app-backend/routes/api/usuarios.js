const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')

//Dentro de controller cada metodo en una accion
let usuarioController = require('../../controllers/api/usuarioControllerAPI')

function validarUsuario(req,res,next){
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded){
        if(err){  
        res.json({
            status: "error",
            message: err.message, data:null
        })
        }else{
            req.body.userId = decoded.id
            next()
        }
    })
}

router.get('/',validarUsuario, usuarioController.usuario_list)
router.post('/create', usuarioController.usuario_create)
router.post('/reservar', usuarioController.usuario_reservar)



module.exports = router
