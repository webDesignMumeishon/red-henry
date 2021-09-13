var express = require('express');
var router = express.Router();
let tokenController = require('../controllers/token')
console.log(tokenController)

router.get('/confirmation/:token', tokenController.confirmationGet)

module.exports = router;
