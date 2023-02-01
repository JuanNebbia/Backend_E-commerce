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
        const {cid, pid} = req.params
        const addProduct = await cartManagerMongo.addProductToCart(cid, pid)
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


router.delete('/:cid/product/:pid', async(req,res)=>{
    try {
        const {cid, pid} = req.params
        const deletedProduct = await cartManagerMongo.deleteProductFromCart(cid, pid)
        res.send({
            status: 'success',
            newCart: deletedProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.delete('/:cid', async(req,res)=>{
    try {
        const { cid }= req.params
        const result = await cartManagerMongo.deleteAllProducts(cid)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

module.exports = router