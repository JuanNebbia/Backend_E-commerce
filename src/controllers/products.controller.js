const ProductManagerMongo = require("../dao/mongoManagers/ProductManagerMongo");
const HTTP_STATUS = require ("../constants/api.constants.js")
const { apiSuccessResponse } = require("../utils/api.utils.js")

const productsDao = new ProductManagerMongo()

class ProductsController{

    static async getAll(req, res, next) {
        try {
            const products = await productsDao.getProducts(req.query)
            const data ={
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: null,
                nexLink: null
            }
            const response = apiSuccessResponse(data)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        const { pid } = req.params
        try {
            const product = await productsDao.getProductById(pid)
            const response = apiSuccessResponse({product})
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async addProduct(req,res,next) {
        try {
            const newProduct = req.body
            if(req.files){
                const paths = req.files.map(file => {
                    return {path: file.path,
                     originalName: file.originalname  
                    }  
                    })
                newProduct.thumbnails = paths
            }else{
                newProduct.thumbnails = []
            }
            if(!Object.keys(newProduct).length){
                throw new Error('Error: Missing product')
            }
            const addProduct = await productsDao.addProduct(newProduct)
            const response = apiSuccessResponse(addProduct)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async updateProduct(req, res, next){
        const productId = req.params.pid
        try {
            if(req.body.id){
                throw new Error("No id must be provided")
            }
            const updateProduct = await productsDao.updateProduct(productId, req.body)
            const response = apiSuccessResponse(updateProduct)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async deleteProduct(req, res, next){
        const productId = req.params.pid
        try {
            const deleteProduct = await productsDao.deleteProduct(productId)
            const response = apiSuccessResponse(deleteProduct)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }    
}

module.exports = ProductsController