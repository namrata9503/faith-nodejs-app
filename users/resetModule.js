// module.exports=   transporter = require('nodemailer');
require('dotenv').config()

var nodemailer = require('nodemailer');
exports.transporter = require('nodemailer');

  transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD
  }
})


exports.getPasswordResetURL = (user, token) =>
  `http://localhost:4200/reset/${user._id}/${token}`
 // ang_url=(user,token)=>`localhost:4200/reset/${user._id}/${token}`

  exports.resetPasswordTemplate = (user, url) => {
  const from =process.env.EMAIL_LOGIN
  const to =  user.email
  const subject = "🌻 nodejs Password Reset 🌻"
  const html = `
  <p>Hey ${user.name || user.email},</p>
  <p>We heard that you lost your  password. Sorry about that!</p>
  <p>But don’t worry! You can use the following link to reset your password:</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 1 hour, it will expire.</p>`

  return { from, to, subject, html }
}