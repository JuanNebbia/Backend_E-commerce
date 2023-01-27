const mongoose = require('mongoose')

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products:{
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                }
            }
        ],
        default: [],
        required: true
    }
})

cartSchema.pre('find', function(){
    this.populate('products.product')
})

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = cartModel