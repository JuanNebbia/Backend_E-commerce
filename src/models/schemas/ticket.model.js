const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true,
    },
    products:{
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity:{
                    type: Number,
                    default: 1,
                    required: true
                }
            }
        ],
        required: true
    }
})

ticketSchema.pre('findById', function(){
    this.populate('product')
})

ticketSchema.pre('find', function(){
    this.populate('products.product')
})

ticketSchema.pre('findOne', function(){
    this.populate('products.product')
})

ticketSchema.plugin(mongoosePaginate)
const ticketModel = mongoose.model(ticketCollection, ticketSchema)

module.exports = ticketModel