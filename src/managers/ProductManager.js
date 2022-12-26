const fs = require('fs/promises')
const { existsSync } = require('fs');

class ProductManager {
    constructor(path){
        this.path = path
    }

    async getProducts() {
        try{
            if (existsSync(this.path)){
                const products = await fs.readFile(this.path, 'utf-8')
                if(products.length > 0){
                    const parsedProducts = JSON.parse(products)
                    return parsedProducts
                }
                else return []
            }
            else return []
        }
        catch(error){
            console.log(error.message)
        }
    }

    async getProductById(id) {
        try{
            const savedProducts = await this.getProducts();
            const selectedProduct = savedProducts.find(prod => prod.id === id)
            if(!selectedProduct){
                return { error:'ERROR: no product matches the specified ID' }
            }
            return selectedProduct
        }
        catch(error){
            console.log(error.message)
        }
    }

    async addProduct(product) {
        try{
            const savedProducts = await this.getProducts()
            const DuplicatedProduct = savedProducts.find(item => item.code == product.code)
            if (DuplicatedProduct){
                return { error: `ERROR: Unable to add. The next code has been already added: ${product.code}` }
            }
            if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category){
                return { error: `ERROR: Unable to add. Missing fields` }
            }
            const newId = savedProducts.length > 0 ? savedProducts[savedProducts.length -1 ].id + 1 : 1
            const newProduct = {
                id: newId,
                status: product.status || true,
                thumbnails: product.thumbnails || [],
                ...product
            }
            savedProducts.push(newProduct)
            const productListString = JSON.stringify(savedProducts, null, '\t')
            await fs.writeFile(this.path, productListString)
            console.log(`${product.title} added`)
            return newProduct
        }
        catch(error){
            console.log(error.message)
        }
    }

    async updateProduct(id, product) {
        try{
            const savedProducts = await this.getProducts()
            const targetProduct = await this.getProductById(id)
            if(targetProduct.error){
                return { error: targetProduct.error}
            } 
            const updatedProduct = {...targetProduct, ...product}
            const updatedList = savedProducts.map(prod =>{
                if(prod.id === id){
                    return updatedProduct
                }else{
                    return prod
                }
            })
            const productListString = JSON.stringify(updatedList, null, '\t')
            await fs.writeFile(this.path, productListString)
            console.log('product modified')
            return updatedProduct
        }
        catch(error){
            console.log(error.message)
        }
    }

    async deleteProduct(id) {
        try{
            const savedProducts = await this.getProducts();
            const targetProduct = await this.getProductById(id)
            const filteredList = savedProducts.filter(prod => prod.id !== id)
            if(targetProduct.error){
                return { error: targetProduct.error }
            }
            const productListString = JSON.stringify(filteredList, null, '\t')
            await fs.writeFile(this.path, productListString)
            console.log(`${targetProduct.title} deleted`)
            return targetProduct   
        }
        catch(error){
            console.log(error.message)
        }
    }
}

module.exports = ProductManager




