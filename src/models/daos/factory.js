const { DATA_SOURCE } = require("../../config/enviroment.config");
const { logCyan } = require('../../utils/console.utils')

let cartDao, chatDao, productsDao, userDao

logCyan(`Using ${DATA_SOURCE} as persistence method`)

switch(DATA_SOURCE){

    case "FILE": {
        const CartFileDao = require('./file/CartFileDao')
        const ProductFileDao = require('./file/ProductFileDao')
        cartDao = new CartFileDao()
        productsDao = new ProductFileDao()
        break;
    }

    case "MONGO": {
        const CartMongoDao = require('./mongo/CartMongoDao')
        const { ProductMongoDao } = require('./mongo/ProductMongoDao')
        const ChatMongoDao = require('./mongo/ChatMongoDao')
        const UserMongoDao = require('./mongo/UserMongoDao')
        cartDao = new CartMongoDao()
        productsDao = new ProductMongoDao()
        chatDao = new ChatMongoDao()
        userDao = new UserMongoDao()
        break;
    }
 
    default: {
        throw new Error('You must provide a valid persistence method')
    }
}

const getDaos = () => {
    console.log(cartDao);
    return {
        cartDao,
        productsDao, 
        chatDao,
        userDao
    }
}

module.exports = getDaos