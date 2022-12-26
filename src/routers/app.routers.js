const { Router } = require('express')
const productsRoutes = require('./products/products.routes')
const cartRoutes = require('./carts/carts.routes')

const router = Router()

router.use('/products', productsRoutes)
router.use('/carts', cartRoutes)

module.exports = router