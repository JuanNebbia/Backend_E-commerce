const { Router } = require('express')
const uploader = require('../../utils')
const ProductManager = require('../../dao/fileManagers/ProductManager')
const ProductManagerMongo = require('../../dao/mongoManagers/ProductManagerMongo')
const options = require('../../config/options')

const router = Router()

const productService = new ProductManager(options.fileSystem.productsFileName)
const productMongoService = new ProductManagerMongo()

router.get('/', async (req, res)=>{
    const limit = req.query.limit
    try {
        const products = await productMongoService.getProducts()
        if(!limit){
            return res.send({
                status: 'success',
                data: products})
        }
        const limitedProducts = products.slice(0,limit)
        res.send({
            status: 'success',
            data: limitedProducts
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.get('/:pid', async (req, res)=>{
    const id = req.params.pid
    try {
        const product = await productMongoService.getProductById(id)
        res.send({product})
        
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.post('/', uploader.array('files'), async (req, res) =>{
    try {
        const newProduct = req.body
        if(req.files){
            const paths = req.files.map(file => file.path)
            newProduct.thumbnails = paths
        }
        if(!Object.keys(newProduct).length){
            throw new Error('Error: Missing product')
        }
        const addProduct = await productMongoService.addProduct(newProduct)
        res.send({
            status: 'success',
            added: addProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.put('/:pid', async(req, res)=>{
    const productId = req.params.pid
    try {
        if(req.body.id){
            throw new Error("No id must be provided")
        }
        const updateProduct = await productMongoService.updateProduct(productId, req.body)
        res.send({
            status: 'success',
            newProduct: updateProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }

})

router.delete('/:pid', async(req, res)=>{
    const productId = req.params.pid
    try {
        const deleteProduct = await productMongoService.deleteProduct(productId)
        res.send({
            status: 'success',
            deletedProduct: deleteProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

module.exports = router