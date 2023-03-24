const messageModel = require('../../schemas/message.model')
const { logYellow } = require('../../../utils/console.utils')
const MongoManager = require('../../db/mongo/mongo.manager')

class ChatMongoDao {

    constructor(){
        MongoManager.connect()
    }
    
    async getMessages() {
        const messages = await messageModel.find().lean()
        return messages
    }

    async addMessage(newMessage) {
        const message = await messageModel.create(newMessage)
        return message
    }

    async deleteMessage(mid) {
        const cleanChat = await messageModel.deleteOne({_id: mid})
        logYellow(`message deleted`)
        return cleanChat  
    }

    async deleteAllMessages() {
        const cleanChat = await messageModel.deleteMany()
        logYellow(`chat cleaned`)
        return cleanChat  
    }

}

module.exports = ChatMongoDao