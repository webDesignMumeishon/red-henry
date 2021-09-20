let express = require('express')
let router = express.Router()
const Usuario = require('../models/usuario')
const Token = require('../models/token')


// router.post('/login', function(req, res, next){

//     console.log(passport.authenticate('local'))
//     passport.authenticate('local', function(err, usuario, info){
//       if(err) return next(err)
  
//       if(!usuario) return res.render('session/login', {info})
  
//       req.logIn(usuario, function(err){
//         console.log(usuario)
//         if(err) return next(err)
//         return res.redirect('/')
  
//       })
//     })(req, res, next);
//   })

router.post('/forgotPassword', function(req, res){
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    if (!usuario) return res.json({info: {message: 'No existe el usuario'}});
    usuario.resetPassword(function(err){
      if (err) return next(err);
      console.log('session/forgotPasswordMessage');
    });
    res.json({message: "Se envio un correo a tu cuenta", creation: true});
  });
})

router.post('/resetPassword',  function(req, res){
  if (req.body.password != req.body.repassword) {
    res.json({msg: "No coinciden las passwords"})
    return;
  }
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    usuario.password = req.body.password;
    usuario.save(function(err){
      if (err) {
        res.json({msg: "Hubo un error"})
      } else{
        res.json({msg: "Se cambio la contraseña", token: true})
      }
    });
  });
});

router.get('/resetPassword/:token',  function(req, res, next){
  Token.findOne({ token: req.params.token })
  .then(token => {
    if(!token){
      throw new Error("Token not verified") 
    }
    return  Usuario.findById(token._userId)
  })
  .then(usuario => {
    if (!usuario) throw new Error("Token was not assign to User") 
    res.json({msg: "Token validation successful !", token: true})
  })
  .catch(err => {
    res.json({msg: err.message, token: false})
  })
});

module.exports = router
