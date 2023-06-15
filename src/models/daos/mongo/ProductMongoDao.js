const productModel = require('../../schemas/product.model')

class ProductMongoDao {
    
    async getAll(filter, options) {
        const products = await productModel.paginate(filter, options)
        return products
    }

     async getById(pid) {
        const product = await productModel.findById(pid)
        return product
    }

    async add(payload) {
        await productModel.create(payload)
        const newProduct = {
            status: payload.status || true,
            thumbnails: payload.thumbnails || [],
            ...payload
        }
        return newProduct
    }

    async updateById(pid, payload) {
        const updatedProduct = await productModel.updateOne({_id: pid}, payload)
        return updatedProduct
    }

    async delete(pid) {
        const deletedProduct = await productModel.deleteOne({_id: pid})
        return deletedProduct   
    }

}

module.exports = ProductMongoDao