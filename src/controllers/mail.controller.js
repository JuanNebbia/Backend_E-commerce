const { gmailTransport } = require('../config/tranports.config.js')

class MailController {

    static async sendEmail(req, res, next) {
        const userEmail = req.body.email
        try {
            let mailInfo = await gmailTransport.sendMail({
                from: 'E-commerce <juan.nebbia@gmail.com>',
                to: userEmail,
                subject: 'Password recovering',
                html: `
                <div>
                    <h1>Password recovering</h1>
                    <p>Enter the next link to restore your password</p>
                    <a href='#'>Recovering link</a>
                    <p>ignore this email if you didn't send it</p>
                </div>`,
                attachments: []
            })
            req.logger.info('email sent => ' + JSON.stringify(mailInfo))
            return res.redirect('/login')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = MailController