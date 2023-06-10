const { gmailTransport } = require('../config/tranports.config.js')

class MailService {

    async recoverPassword(userEmail, token, fullUrl){
        if(!token){
            throw new HttpError('Missing token', HTTP_STATUS.BAD_REQUEST)
        }
        if(!fullUrl){
            throw new HttpError('Missing url', HTTP_STATUS.BAD_REQUEST)
        }
        const mailInfo = await gmailTransport.sendMail({
            from: 'E-commerce <juan.nebbia@gmail.com>',
            to: userEmail,
            subject: 'Password recovering',
            html: `
            <div>
                <h1>Password recovering</h1>
                <p>Enter the next link to restore your password</p>
                <a href=${fullUrl + '?token=' + token} >Recovering link</a>
                <p>ignore this email if you didn't send it</p>
            </div>`,
            attachments: []
        })
        return mailInfo
    }

    async notifyDeletion(userEmail, userName){
        const mailInfo = await gmailTransport.sendMail({
            from: 'E-commerce <juan.nebbia@gmail.com>',
            to: userEmail,
            subject: 'We will miss you!',
            html: `
            <div>
                <h1>Your account has been deactivated</h1>
                <p>Dear ${userName}, we regret to notify you that your account has been closed due to inactivity. Our doors are always open if you want to re-register. Until next time!</p>
                <p>E-commerce team</p>
            </div>`,
            attachments: []
        })
        return mailInfo
    }

    async productDeletion(userEmail, productTitle){
        const mailInfo = await gmailTransport.sendMail({
            from: 'E-commerce <juan.nebbia@gmail.com>',
            to: userEmail,
            subject: 'Product deletion notification',
            html: `
            <div>
                <h1>A product you own has been deleted: ${productTitle}</h1>
                <p>E-commerce team</p>
            </div>`,
            attachments: []
        })
        return mailInfo
    }

}

module.exports = MailService