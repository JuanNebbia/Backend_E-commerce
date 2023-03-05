const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String
    },
    lastName: { 
        type: String
    },
    email: { 
        type: String,
        unique: true
    },
    age: { 
        type: Number
    },
    password: {
        type: String
    },
    githubLogin:{
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'carts'
    }
})

userSchema.plugin(mongoosePaginate)
const userModel = mongoose.model(userCollection, userSchema)

module.exports = userModel