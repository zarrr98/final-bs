const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user : "translationsite1@gmail.com",
    pass : "strongPassWORD$$22"
  }
})



module.exports = transporter;