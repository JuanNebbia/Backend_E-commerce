const getDaos = require('../models/daos/factory')
const CartsService = require('../services/carts.service.js')
const ProductsService = require('../services/products.service.js')
const TicketsService = require('../services/tickets.service.js')
const UsersService = require('../services/users.service')

const { chatsDao, ticketsDao } = getDaos()

const productsService = new ProductsService()
const cartsService = new CartsService()
const ticketsService = new TicketsService()
const usersService = new UsersService()

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

    static async recover(req, res, next) {
        res.render('recover', {
            title: 'Recover your password',
            styles: 'recover.css'
        })
    }

    static async products(req, res, next) {
        const { user } = req
        const { limit, page, query, sort } = req.query
        const protocol = req.protocol
        const host = req.get('host')
        try {
            const products = await productsService.getProducts(limit, page, query, sort, protocol, host)
            const admin = user.role === 'admin'
            let cart
            if(!admin){
                cart = await cartsService.getCartById(user.cart)
            }
            const premium = user.role === 'premium'
            res.render('index', {
                title: "E-commerce",
                styles:"index.css",
                products,
                user,
                cart,
                admin,
                premium,
            })
        } catch (error) {
            next(error)
        }
    }

    static async productDetail(req, res, next) {
        const { user } = req
        const { pid } = req.params
        try {
            const admin = user.role === 'admin'
            let cart
            if(!admin){
                cart = await cartsService.getCartById(user.cart)
            }
            const product = await productsService.getProductById(pid)
            res.render('productDetail', {
                title: product.title,
                styles: 'detail.css',
                product,
                cart,
                user,
                admin
            })
        } catch (error) {
            next(error)
        }
    }

    static async cart(req, res, next) {
        const { cid } = req.params 
        const { user } = req
        try {
            const cart = await cartsService.getCartById(cid)
            const admin = user.role === 'admin'
            res.render('cart', {
                title: "Cart",
                styles:"cart.css",
                user,
                cart,
                admin
            })
        } catch (error) {
            next(error)
        }
    }

    static async users(req, res, next) {
        const { user } = req
        try {
            const admin = user.role === 'admin'
            const usersList = await usersService.getAll()
            res.render('users', {
                title: "Usuarios",
                styles:"users.css",
                usersList,
                user,
                admin
            })
            
        } catch (error) {
            next(error)
            
        }
    }

    static async profile(req, res, next){
        const { user } = req
        const { uid } = req.params
        try {
            const userData = await usersService.getById(uid)
            res.render('profile', {
                title: "Perfil",
                styles:"profile.css",
                user,
                userData
            })
        } catch (error) {
            next(error)
        }
    }

    static async newProduct(req, res, next){
        const { user } = req
        try {
            const admin = user.role === 'admin'
            res.render('newProduct', {
                title: "Crear Producto",
                styles:"newproduct.css",
                user,
                admin
            })
        } catch (error) {
            next(error)
        }

    }

    static async chat(req, res, next) {
        try{
            const messages = await chatsDao.getAll()
            res.render('chat', {
                title: "Super Chat!",
                styles:"chat.css",
                messages})
        }catch (error) {
            next(error)
        }
    }

    static async ticket(req, res, next) {
        const { user } = req
        const { tid } = req.params 
        try{
            const ticket = await ticketsService.getTicketById(tid)
            res.render('ticket', {
                title: "Purchase Ticket",
                styles:"ticket.css",
                ticket,
                user
                })
        }catch (error) {
            next(error)
        }
    }

    static async passwordForm(req, res, next){
        const { token } = req.query
        try {
            res.render('newPasswordForm', {
                title: "Generate new password",
                styles:"passwordform.css",
                token
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ViewsController