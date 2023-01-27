const { Router } = require('express')
const messageModel = require('../../dao/models/message.model')

const router = Router()

router.get('/', async (req,res)=>{
    const messages = await messageModel.find().lean()
    res.render('chat', {messages})
})

router.post('/', async (req,res)=>{
    const socket = req.app.get('socket')
    const newMessage = req.body
    await messageModel.create(newMessage)
    socket.emit('newMessage', newMessage)
})


module.exports = router