const { Router } = require('express')
const productsRoutes = require('./products/products.routes')
const cartRoutes = require('./carts/carts.routes')
const chatRoutes = require('./chat/chat.routes')

const router = Router()

router.use('/products', productsRoutes)
router.use('/carts', cartRoutes)
router.use('/chat', chatRoutes)

module.exports = router