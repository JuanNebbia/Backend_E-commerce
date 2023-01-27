const cartModel = require('../models/cart.model')

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
            const cart = await cartModel.find({_id: id})
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

    async addProduct(cartId, productId){
        try {
            let cart = await this.getCartById(cartId)
            cart.products.push({product: productId})
            let result = await cartModel.updateOne({_id:cartId}, cart) 
            return result          
        } catch (error) {
            throw new Error(error.message)
        }
    }
}


module.exports = CartManagerMongo