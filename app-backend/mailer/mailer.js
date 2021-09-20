// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "muma.sanmartin2011@gmail.com", 
      pass: "gjfigjwnchrxfzvj", 
    },
  });

  transporter.verify(() => {
      console.log("Ready for emails")
  })

module.exports = transporter