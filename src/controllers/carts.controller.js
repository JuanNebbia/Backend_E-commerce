const CartManagerMongo = require("../dao/mongoManagers/CartManagerMongo");
const HTTP_STATUS = require ("../constants/api.constants.js")
const { apiSuccessResponse } = require("../utils/api.utils.js")

const cartsDao = new CartManagerMongo()

class CartsController{

    static async getAll(req, res, next) {
        try {
            const cart = await cartsDao.getCarts() 
            const response = apiSuccessResponse(cart)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        const id = req.params.cid
        try {
            const cart = await cartsDao.getCartById(id)
            const response = apiSuccessResponse(cart)
            res.status(HTTP_STATUS.OK).json(response) 
        } catch (error) {
            next(error)
        }
    }

    static async addCart(req,res,next) {
        try {
            const addCart = await cartsDao.addCart()
            const response = apiSuccessResponse(addCart)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async addProduct(req, res, next){
        try {
            const {cid, pid} = req.params
            const amount = +req.body?.amount || 1
            const addProduct = await cartsDao.addProductToCart(cid, pid, amount)
            const response = apiSuccessResponse(addProduct)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async updateProducts(req, res, next){
        const { cid } = req.params
        const newProducts = req.body
        try {
            const updatedCart = await cartsDao.updateProducts(cid, newProducts)
            const response = apiSuccessResponse(updatedCart)
            res.status(HTTP_STATUS.OK).json(response)
            
        } catch (error) {
            next(error)
        }
    }   
    
    static async updateQuantity(req, res, next){
        const {cid, pid} = req.params
        const amount = req.body.quantity
        try {
            if(!amount){
                throw new Error('an amount of product must be provided')
            }
            const updateProduct = await cartsDao.addProductToCart(cid, pid, amount)
            const response = apiSuccessResponse(updateProduct)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
    
    static async removeProducts(req, res, next){
        try {
            const {cid, pid} = req.params
            const deletedProduct = await cartsDao.deleteProductFromCart(cid, pid)
            const response = apiSuccessResponse(deletedProduct)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async clearCart(req, res, next){
        try {
            const { cid }= req.params
            const result = await cartsDao.deleteAllProducts(cid)
            const response = apiSuccessResponse(result)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CartsController