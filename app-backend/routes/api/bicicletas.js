const express = require("express")
const router = express.Router()
//Dentro de controller cada metodo en una accion
let bicicletaController = require('../../controllers/api/bicicletaControllerAPI')

router.get('/', bicicletaController.bicicleta_list)
router.post('/create', bicicletaController.bicicleta_create)
router.delete('/delete', bicicletaController.bicicleta_delete)
router.put('/update', bicicletaController.bicicleta_update)


module.exports = router
