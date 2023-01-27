const productModel = require('../models/product.model')

class ProductManagerMongo {
    
    async getProducts() {
        try {
            const products = await productModel.find()
            return products
        } catch (error) {
            throw new Error(error.message)
        }
    }

     async getProductById(id) {
        try{
            const product = await productModel.findById(id)
            if(!product){
                throw new Error('ERROR: no product matches the specified ID')
            }
            return product
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async addProduct(product) {
        try{
            await productModel.create(product)
            console.log(`${product.title} added`)
            const newProduct = {
                status: product.status || true,
                thumbnails: product.thumbnails || [],
                ...product
            }
            return newProduct
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async updateProduct(id, product) {
        try{
            const updatedProduct = await productModel.updateOne({_id: id}, product)
            console.log(`${product.title} modified`)
            return updatedProduct
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async deleteProduct(id) {
        try{
            const deletedProduct = await productModel.deleteOne({_id: id})
            console.log(`product deleted`)
            return deletedProduct   
        }
        catch(error){
            throw new Error(error.message)
        }
    }

}

module.exports = ProductManagerMongo