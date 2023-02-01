const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')

class CartManagerMongo {

    async getCarts() {
        try{
            const carts = await cartModel.find()
            return carts
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async getCartById(id) {
        try{
            const cart = await cartModel.findOne({_id: id})
            return cart

        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async addCart(){
        try{
            const newCart = await cartModel.create({})
            return newCart
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async addProductToCart(cartId, productId){
        try {
            let cart = await this.getCartById(cartId)
            const product = await productModel.findById(productId)
            cart.products.push({product: productId})
            let result = await cartModel.updateOne({_id:cartId}, cart) 
            return result          
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProductFromCart(cartId, productId){
        try {
            const cart = await this.getCartById(cartId)
            const productToDelete = cart.products.find(product => product.product == productId)
            const index = cart.products.indexOf(productToDelete)
            if(index < 0){
                throw new Error('Product not found')
            }
            cart.products.splice(index, 1)
            const result = cartModel.updateOne({_id:cartId}, cart)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteAllProducts(cartId){
        try {
            const cart = await this.getCartById(cartId)
            cart.products = []
            const result = cartModel.updateOne({_id:cartId}, cart)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}


module.exports = CartManagerMongo