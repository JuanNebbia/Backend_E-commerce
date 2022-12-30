const { Router } = require('express')
const uploader = require('../../utils')
const ProductManager = require('../../managers/ProductManager')

const router = Router()

const productManager = new ProductManager('./products.json')

router.get('/', async (req, res)=>{
    const products = await productManager.getProducts()
    const limit = req.query.limit
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
})

router.get('/:pid', async (req, res)=>{
    const id = Number(req.params.pid)
    const product = await productManager.getProductById(id)
    if(product.error){
        return res.status(400).send({
            error: product.error
        })
    }
    res.send({product})
})

router.post('/', uploader.array('files'), async (req, res) =>{
    const newProduct = req.body
    if(req.files){
        const paths = req.files.map(file => file.path)
        newProduct.thumbnails = paths
    }
    if(!Object.keys(newProduct).length){
        return res.status(400).send('Error: Missing product')
    }
    const addProduct = await productManager.addProduct(newProduct)
    if(addProduct.error){
        return res.status(400).send({
                error: addProduct.error
            })
    }
    res.send({
        status: 'success',
        added: addProduct
    })
})

router.put('/:pid', async(req, res)=>{
    const productId = Number(req.params.pid)
    if(req.body.id){
        return res.status(400).send({
            error: "No id must be provided"
        })
    }
    const updateProduct = await productManager.updateProduct(productId, req.body)
    if(updateProduct.error){
        return res.status(400).send({
                    error: updateProduct.error
                })
    }
    res.send({
        status: 'success',
        newProduct: updateProduct
    })
})

router.delete('/:pid', async(req, res)=>{
    const productId = Number(req.params.pid)
    const deleteProduct = await productManager.deleteProduct(productId)
    if(deleteProduct.error){
        return res.status(400).send({
            error: deleteProduct.error
        })
    }
    res.send({
        status: 'success',
        deletedProduct: deleteProduct
    })
})

module.exports = router