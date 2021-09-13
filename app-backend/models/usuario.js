let mongoose = require('mongoose')
let Reserva = require('./reserva')
const uniqueValidator = require('mongoose-unique-validator')
let Schema = mongoose.Schema
const Token = require('./token')
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const mailer = require('../mailer/mailer')
const sgMail = require('@sendgrid/mail')
const env = require('dotenv').config()
const saltRounds = 10

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        require: [true, 'The name is Mandatory']
    },

    email: {
        type: String,
        trim: true,
        require: [true, 'The email is Mandatory'],
        //when saving all the caracters are converted into lowercase
        lowercase: true,
        //in the method property we pass in the arguments, first the function to validate the input, and then 
        // an invalid massage
        validate: [validateEmail, 'Please, insert a valid email'],
        //the db can only have one user associated to an email (npm i mongoose-unique-validator --save)
        unique: true,
        //match, whaever input has to match this sequence, it runs in the mondoDB level
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
    },

    cohorte:{
        type: String,
    },

    password: {
        type: String,
        require: [true, 'The password is Mandatory']
    },

    ubicacion: {
        type: [Number], index: {type: '2dsphere', sparse: true}
    },
    
    passwordResetToken: String,

    passwordResetTokenExpires: Date,

    verified: {
        type: Boolean,
        default: false
    }
})

//Before saving the new instance this function will be executed
usuarioSchema.pre("save", function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds)
    }
    next()
})

//the validator for the unique email is added as a plugin
usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario'})

//password comparisson 
usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}


usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    let reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta})
    return reserva.save()
}

usuarioSchema.methods.enviar_email_bienvenida = function(cb){
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) { return console.log(err.message); }

        console.log(process.env.SENDGRID_API_KEY)
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
            to: email_destination, // Change to your recipient
            from: 'muma.sanmartin2011@gmail.com', // Change to your verified sender
            subject: 'Account Verification',
            text: 'Hola,\n\n'+ 'Por favor, para verificar su cuenta haga click abajo',
            html: `<a href="http://localhost:3000/token/confirmation/${token.token}">Click To Verify</a>`
        }

        sgMail.send(msg).then(() => {
        console.log('Email sent')
        })
         .catch((error) => {
            console.error("ok",error)
        })
    });

};  


usuarioSchema.methods.resetPassword = function(password){
    //TODO
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) { return console.log(err.message); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta',
            text: 'Hola,\n\n'+ 'Por favor, para resetear el password de su cuenta haga click en este link: \n' + 'http://localhost:3000' + '/resetPassword/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function(err, result) {
            if (err) { return console.log(err); }

            console.log('Se ha enviado un email de reseteo de password a:  '+ email_destination + '.');
        });
    });
}

module.exports = mongoose.model("Usuario", usuarioSchema)