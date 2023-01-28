const { Router } = require('express')
const messageModel = require('../../dao/models/message.model')
const productModel = require('../../dao/models/product.model')

const router = Router()

router.get('/', async (req, res) => {
    const products = await productModel.find().lean()
    res.render('index', {
        title: "E-commerce",
        styles:"index.css",
        products
    })
})

router.get('/chat', async (req,res)=>{
    const messages = await messageModel.find().lean()
    res.render('chat', {
        title: "Super Chat!",
        styles:"chat.css",
        messages})
})



module.exports = router