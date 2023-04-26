const nodemailer = require('nodemailer')
const { EMAIL_PASSWORD, EMAIL } = require('./enviroment.config.js')

const gmailTransport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
})

module.exports = {
    gmailTransport
}