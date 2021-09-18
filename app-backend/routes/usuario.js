const express = require("express")
const router = express.Router()
//Dentro de controller cada metodo en una accion
let usuarioController = require('../controllers/usuario')

router.get('/', usuarioController.list)
router.get('/create', usuarioController.create_get)
router.post('/create', usuarioController.create)
// router.post('/reservar', usuarioController.usuario_reservar)
router.get('/:id/update', usuarioController.update_get)
router.post('/:id/update', usuarioController.update)
router.post('/:id/delete', usuarioController.delete)



module.exports = router
