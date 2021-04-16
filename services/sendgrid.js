const sgMail = require('@sendgrid/mail')
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')

sgMail.setApiKey(process.env.SG_API_KEY)

const getTemplate = (filename, body) => {
  const emailTemplatePath = path.join(__dirname, 'email_templates', filename)
  const template = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' })
  return ejs.render(template, body)
}

const collection = {
  resetPassword: body => ({
    subject: 'Reset password',
    html: getTemplate('resetPassword.html', body)
  })
}

const services = {}

services.send = function (type, body, callback) {
  return new Promise((resolve, reject) => {
    const param = {
      to: body.sEmail,
      from: Process.env.SENDER_MAIL,
      subject: type(body).subject,
      html: type(body).html
    }
    sgMail
      .send(param)
      .then(response => (callback ? callback(null, response) : resolve(response)))
      .catch(error => (callback ? callback(error) : reject(error)))
  })
}

module.exports = { ...services, ...collection }

// const mail = new SendGrid();
// mail.send(mail.verification, { sEmail: 'shivam.m@yudiz.in', sLink: 'https://www.google.com' }, console.log);
