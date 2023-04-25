const nodemailer = require('nodemailer')
const gmailAppPass = 'khuuejlwujktyrog'

const gmailTransport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'juan.nebbia@gmail.com',
        pass: gmailAppPass
    }
})

module.exports = {
    gmailTransport
}