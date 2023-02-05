const { Router } = require('express')
const messageModel = require('../../dao/models/message.model')
const productModel = require('../../dao/models/product.model')
const ProductManagerMongo = require('../../dao/mongoManagers/ProductManagerMongo')
const CartManagerMongo = require('../../dao/mongoManagers/CartManagerMongo')

const router = Router()

const productMongoService = new ProductManagerMongo()
const cartMongoService = new CartManagerMongo()

router.get('/products', async (req, res) => {
    try {
        const products = await productMongoService.getProducts(req.query)
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

router.get('/cart/:cid', async (req, res) => {
    const cartId = req.params.cid 
    try {
        const cart = await cartMongoService.getCartById(cartId)
        res.render('cart', {
            title: "Cart",
            styles:"cart.css",
            products: cart.products,
            cartId: cart._id
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