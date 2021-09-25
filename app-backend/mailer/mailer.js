// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "find.henry.app@gmail.com", 
      pass: "kisxgfhbihrwtvdl", 
    },
  });

  transporter.verify(() => {
      console.log("Ready for emails")
  })

module.exports = transporter