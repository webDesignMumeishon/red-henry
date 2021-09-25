// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');
require('dotenv').config();

const {
  GMAIL_USER_MAILER, GMAIL_USER_PASSWORD
} = process.env;


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER_MAILER, 
      pass: GMAIL_USER_PASSWORD, 
    },
  });

  transporter.verify(() => {
      console.log("Ready for emails")
  })

module.exports = transporter