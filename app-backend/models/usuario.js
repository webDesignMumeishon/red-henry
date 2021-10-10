let mongoose = require('mongoose')
let Reserva = require('./reserva')
const uniqueValidator = require('mongoose-unique-validator')
let Schema = mongoose.Schema
const Token = require('./token')
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const transporter = require('../mailer/mailer')
const sgMail = require('@sendgrid/mail')
const env = require('dotenv').config()
const saltRounds = 10

const { CORS_BACKEND} = process.env

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
        //match, whatever input has to match this sequence, it runs in the mondoDB level
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
    },

    cohorte:{
        type: String,
    },

    linkedin: {
        type: String,
        require: [true, 'The linkedin is Mandatory'],
        default: '#'
    },

    github: {
        type: String,
        require: [true, 'The github is Mandatory'],
        default: '#'
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


console.log(CORS_BACKEND)
usuarioSchema.methods.enviar_email_bienvenida = function(cb){
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;

    token.save( async function (err) {
        if (err) { return console.log(err.message); }
        console.log(`${CORS_BACKEND}/token/confirmation/${token.token}`)
        try{
            await transporter.sendMail({
                from: '<verification@app.com>', // sender address
                to: email_destination, // list of receivers
                subject: "Email Verification", // Subject line
                text: "Verify your account in the link down below", // plain text body
                html: `<a href="${CORS_BACKEND}/token/confirmation/${token.token}">${CORS_BACKEND}/token/confirmation/${token.token}</a>`
            })    
        }
        catch(err){
            throw new Error(err)
        }
    });

};  


usuarioSchema.methods.resetPassword = function(password){
    //TODO
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save( async function (err) {
        if (err) { return console.log(err.message); }

        try{
            await transporter.sendMail({
                from: '<verification@app.com>', // sender address
                to: email_destination, // list of receivers
                subject: "Reset password", // Subject line
                text: "Reset Your Password", // plain text body
                html: `This is an email to reset your password <br/>
                Click <a href="http://localhost:3001/recreatepassword/${token.token}/${email_destination}">here</a> to reset your password
                `
            })    
        }
        catch(err){
            throw new Error(err)
        }
    });
}

module.exports = mongoose.model("Usuario", usuarioSchema)