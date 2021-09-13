const express = require("express")
const router = express.Router()

//Dentro de controler cada metodo en una accion
let bicicletaController = require('../controllers/bicicleta.js')

//This goes to the list of bikes, in the base root URL (bicicletas)
router.get('/', bicicletaController.bicicleta_list)
// |--------------------------------------------------------------------------------------------------------------|
//This goes to the form to update a new bike
router.get('/:code/update', bicicletaController.bicicleta_update_get)
//This updates the bike with the post verb
router.post('/:code/update', bicicletaController.bicicleta_update_post)
// |--------------------------------------------------------------------------------------------------------------|
//This goes to the form to create a new bike
router.get('/create', bicicletaController.bicicleta_create_get)
//This add a new bike with the post emthod
router.post('/create', bicicletaController.bicicleta_create_post)
// |--------------------------------------------------------------------------------------------------------------|
//This is to delete a bike
router.post('/:id/delete', bicicletaController.bicicleta_delete_post)

module.exports = router