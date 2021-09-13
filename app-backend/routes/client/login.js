let express = require('express')
let router = express.Router()



router.post('/login', function(req, res, next){

    console.log(passport.authenticate('local'))
    passport.authenticate('local', function(err, usuario, info){
      if(err) return next(err)
  
      if(!usuario) return res.render('session/login', {info})
  
      req.logIn(usuario, function(err){
        console.log(usuario)
        if(err) return next(err)
        return res.redirect('/')
  
      })
    })(req, res, next);
  })
