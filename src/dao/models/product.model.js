const mongoose = require('mongoose')

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true
    },
    description: { 
        type: String, 
        required: true
    },
    code: { 
        type: String, 
        required: true, 
        unique: true
    },
    price: { 
        type: Number, 
        required: true
    },
    stock: { 
        type: Number, 
        required: true
    },
    category: { 
        type: String, 
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    thumbnails:{
        type: [String],
        required: true,
        default: []
    }
})

const productModel = mongoose.model(productCollection, productSchema)

module.exports = productModel