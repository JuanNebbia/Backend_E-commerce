const { Router } = require('express')
const messageModel = require('../../dao/models/message.model')
const productModel = require('../../dao/models/product.model')
const ProductManagerMongo = require('../../dao/mongoManagers/ProductManagerMongo')

const router = Router()

const productMongoService = new ProductManagerMongo()

router.get('/products', async (req, res) => {
    try {
        const products = await productMongoService.getProducts(req.query)
        console.log(products.docs);
        res.render('index', {
            title: "E-commerce",
            styles:"index.css",
            products: products.docs
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.get('/chat', async (req,res)=>{
    const messages = await messageModel.find().lean()
    res.render('chat', {
        title: "Super Chat!",
        styles:"chat.css",
        messages})
})



module.exports = router