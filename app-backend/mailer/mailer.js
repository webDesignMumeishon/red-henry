// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cecile.reilly@ethereal.email',
        pass: 'GWD1KGbbdSStn7xRTy'
    }
}

module.exports = nodemailer.createTransport(mailConfig)