const ChatManagerMongo = require("../models/daos/mongo/ChatManagerMongo");
const HTTP_STATUS = require ("../constants/api.constants.js")
const { apiSuccessResponse } = require("../utils/api.utils.js");
const HttpError = require("../utils/error.utils");

const chatDao = new ChatManagerMongo()

class ChatController{

    static async getAll(req, res, next) {
        try {
            const messages = await chatDao.getMessages()
            const response = apiSuccessResponse(messages.docs)
            res.render('chat', {
                title: "Super Chat!",
                styles:"chat.css",
                messages})
        } catch (error) {
            next(error)
        }
    }

    static async addMessage(req,res,next) {
        const io = req.app.get('io')
        const newMessage = req.body
        try {
            if(!Object.keys(newMessage).length){
                throw new HttpError(HTTP_STATUS.BAD_REQUEST, 'Missing message')
            }
            const addMessage = await chatDao.addMessage(newMessage)
            io.emit('newMessage', newMessage)
            const response = apiSuccessResponse(addMessage)
            return res.status(HTTP_STATUS.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async deleteMessage(req, res, next){
        const io = req.app.get('io')
        const { mid } = req.params
        try {
            io.emit('deleteMessage', {})
            const deleteMessage = await chatDao.deleteMessage(mid)
            const response = apiSuccessResponse(deleteMessage)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }    

    static async deleteAllMessages(req, res, next){
        const io = req.app.get('io')
        try {
            io.emit('cleanChat', {})
            const deleteMessages = await chatDao.deleteAllMessages()
            const response = apiSuccessResponse(deleteMessages)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    } 
}

module.exports = ChatController