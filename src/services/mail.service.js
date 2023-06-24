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
            from: 'Matete <juan.nebbia@gmail.com>',
            to: userEmail,
            subject: 'Reinicio de contraseña',
            html: `
            <div>
                <h1>Reinicio de contraseña/h1>
                <p>Ingresa al siguiente enlace para ingresar una nueva contraseña</p>
                <a href=${fullUrl + '?token=' + token} >Ingresa aquí</a>
                <p>Si no has enviando este correo, ignóralo</p>
                <small>Equipo Matete</small>
            </div>`,
            attachments: []
        })
        return mailInfo
    }

    async notifyDeletion(userEmail, userName){
        const mailInfo = await gmailTransport.sendMail({
            from: 'Matete <juan.nebbia@gmail.com>',
            to: userEmail,
            subject: '¡Te extrañaremos!!',
            html: `
            <div>
                <h1>Tu cuenta ha sido desactivada</h1>
                <p>Querido ${userName}, lamentamos informarte que tu cuenta ha sido dado de baja por inactividad. Nuestras puertas se encuentran abiertas si te quieres volver a registrar. ¡Hasta la próxima!</p>
                <small>Equipo Matete</small>
            </div>`,
            attachments: []
        })
        return mailInfo
    }

    async productDeletion(userEmail, productTitle){
        const mailInfo = await gmailTransport.sendMail({
            from: 'Matete <juan.nebbia@gmail.com>',
            to: userEmail,
            subject: 'Notificación de eliminación de producto',
            html: `
            <div>
                <h1>Un producto que te pertenece ha sido eliminado: ${productTitle}</h1>
                <small>Equipo Matete</small>
            </div>`,
            attachments: []
        })
        return mailInfo
    }

}

module.exports = MailService