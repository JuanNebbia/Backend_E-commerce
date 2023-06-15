const HTTP_STATUS = require("../constants/api.constants.js");
const getDaos = require("../models/daos/factory.js");
const HttpError = require("../utils/error.utils.js");

const { cartsDao, productsDao } = getDaos()

class CartsService {
    async getCarts() {
        const carts = await cartsDao.getAll()
        return carts
    }

    async getCartById(cid) {
        if(!cid){
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        }
        const cart = await cartsDao.getById(cid)
        if(!cart){
            throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        }
        return cart
    }

    async createCart() {
        const newCart = await cartsDao.add()
        return newCart
    }

    async addProductToCart(cid, pid, amount, user) {
        if(!cid || !pid || !amount){
            throw new HttpError('Missing required params', HTTP_STATUS.BAD_REQUEST)
        }
        const cart = await cartsDao.getById(cid)
        if(!cart){
            throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        }
        const product = await productsDao.getById(pid)
        if(!product){
            throw new HttpError('Product not found', HTTP_STATUS.NOT_FOUND)
        }
        if(product.stock < amount){
            throw new HttpError('Insufficient stock for selected product', HTTP_STATUS.BAD_REQUEST)
        }
        if(product.owner === user.email){
            throw new HttpError('Can not add own products', HTTP_STATUS.FORBIDDEN)
        }
        const existingProduct = cart.products.find(item => item.product.code === product.code)
        const existingProductIndex = cart.products.findIndex(item => item.product.code === product.code)
        let addedProduct
        if(existingProduct){
            cart.products[existingProductIndex].quantity += amount
            addedProduct = await cartsDao.updateCart(cid, cart.products)
        }else{
            addedProduct = await cartsDao.addProductToCart(cid, pid, amount)
        }
        return addedProduct
    }

    async updateCart(cid, products){
        if(!cid){
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        }
        if(!products.length){
            throw new HttpError('Provide a cart payload, must be an array of products', HTTP_STATUS.BAD_REQUEST)
        }
        const cart = await cartsDao.updateCart(cid, products)
        return cart
    }

    async updateProductAmount(cid, pid, amount){
        if(!cid || !pid){
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        }
        if(!amount || isNaN(amount)){
            throw new HttpError('Specify a new amount number for the product', HTTP_STATUS.BAD_REQUEST)
        }
        const cart = await cartsDao.getById(cid)
        if(!cart){
            throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        }
        const product = await productsDao.getById(pid)
        if(!product){
            throw new HttpError('Product not found', HTTP_STATUS.NOT_FOUND)
        }
        if(+amount > product.stock){
            throw new HttpError('Insufficient stock for selected product', HTTP_STATUS.BAD_REQUEST)
        }
        const existingProduct = cart.products.find(item => item.product.code === product.code)
        if(!existingProduct){
            throw new HttpError('This product was not found in current cart', HTTP_STATUS.NOT_FOUND)
        }
        const existingProductIndex = cart.products.findIndex(item => item.product.code === product.code)
        cart.products[existingProductIndex].quantity = +amount
        const updatedCart = await cartsDao.updateCart(cid, cart.products)
        return updatedCart
    }

    async deleteProduct(cid, pid) {
        if(!cid || !pid){
            throw new HttpError('Missing params', HTTP_STATUS.BAD_REQUEST)
        }
        const product = await productsDao.getById(pid)
        if(!product){
            throw new HttpError('Product not found', HTTP_STATUS.NOT_FOUND)
        }
        const cart = await cartsDao.getById(cid)
        if(!cart){
            throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        }
        const deletedProduct = await cartsDao.deleteProductFromCart(cid, pid)
        return deletedProduct
    }

    async clearCart(cid) {
        if(!cid){
            throw new HttpError('Please specify a cart ID', HTTP_STATUS.BAD_REQUEST)
        }
        const cart = await cartsDao.getById(cid)
        if(!cart){
            throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        }
        const emptyCart = await cartsDao.deleteAllProducts(cid)
        return emptyCart
    }
}

module.exports = CartsService