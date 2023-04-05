const getDaos = require('../models/daos/factory')
const ProductsService = require('../services/products.service.js')

const { productsDao, cartsDao, chatsDao } = getDaos()

const productsService = new ProductsService()

class ViewsController{

    static async register(req, res, next) {
        res.render('register', {
            title: 'Sign Up!',
            styles: 'register.css'
        })
    }

    static async login(req, res, next) {
        res.render('login', {
            title: 'Login',
            styles: 'login.css'
        })
    }

    static async products(req, res, next) {
        const user = req.user
        try {
            const products = await productsService.getProducts(req.query)
            res.render('index', {
                title: "E-commerce",
                styles:"index.css",
                products: products.docs,
                user: user
            })
        } catch (error) {
            res.status(500).send({
                status: "error",
                error: error.message
            })
        }
    }

    static async cart(req, res, next) {
        const cartId = req.params.cid 
        const user = req.user
        try {
            const cart = await cartsDao.getById(cartId)
            res.render('cart', {
                title: "Cart",
                styles:"cart.css",
                user,
                cart
            })
        } catch (error) {
            res.status(500).send({
                status: "error",
                error: error.message
            })
        }
    }

    static async chat(req, res, next) {
        const messages = await chatsDao.getAll()
        res.render('chat', {
            title: "Super Chat!",
            styles:"chat.css",
            messages})
    }
}

module.exports = ViewsController