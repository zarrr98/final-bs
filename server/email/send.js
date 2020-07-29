const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user : "translationsite1@gmail.com",
    pass : "95243045"
  }
})



module.exports = transporter;