const { Router } = require('express')
const CartManager = require('../../dao/fileManagers/CartManager')
const CartManagerMongo = require('../../dao/mongoManagers/CartManagerMongo')

const router = Router()

const cartManager = new CartManager('./carts.json')
const cartManagerMongo = new CartManagerMongo()

router.get('/',async (req, res) =>{
    try {
        const cart = await cartManagerMongo.getCarts() 
        res.send({
            status: 'success',
            carts: cart
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.get('/:cid',async (req, res) =>{
    const id = req.params.cid
    try {
        const cart = await cartManagerMongo.getCartById(id) 
        res.send({
            status: 'success',
            cart: cart
        })  
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.post('/:cid/product/:pid', async(req,res)=>{
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const addProduct = await cartManagerMongo.addProduct(cartId, productId)
        res.send({
            status: 'success',
            newCart: addProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.post('/', async(req, res)=>{
    const addCart = await cartManagerMongo.addCart()
    res.send({
        status: 'success',
        cart: addCart
    })
})

module.exports = router