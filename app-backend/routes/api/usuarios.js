const express = require("express")
const router = express.Router()
//Dentro de controller cada metodo en una accion
let usuarioController = require('../../controllers/api/usuarioControllerAPI')

router.get('/', usuarioController.usuario_list)
router.post('/create', usuarioController.usuario_create)
router.post('/reservar', usuarioController.usuario_reservar)



module.exports = router
