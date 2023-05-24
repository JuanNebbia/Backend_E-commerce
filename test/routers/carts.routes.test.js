const { expect } = require('chai')
const supertest = require('supertest')
const cartModel = require('../../src/models/schemas/cart.model.js')
const userModel = require('../../src/models/schemas/user.model.js')
const productModel = require('../../src/models/schemas/product.model.js')

const requester = supertest('http://127.0.0.1:8080')

describe('Carts routes testing', async() => {

    let cartId
    let productId
    let cookie

    it('[POST] /api/carts - Should create a new cart', async()=>{
        const response = await requester.post('/api/carts')
        cartId = response.body.payload._id
        expect(response.statusCode).to.be.eql(201)
    })

    
    it('[POST] /api/session/register - Should register a user and redirect', async function(){
        const mockUser = {
            firstName: 'Mock',
            lastName: 'User',
            age: 25,
            email: 'mock@premium.com',
            password: 'password'
        }
        const response = await requester.post('/api/session/register').send(mockUser)
        expect(response.statusCode).to.be.eql(302)
        expect(response.request._data.email).to.be.eql(mockUser.email)
    })
    
    it('[PUT] /api/users/premium/:uid - Should change user role to premium', async()=>{
        const user = await userModel.findOne({email: 'mock@premium.com'}).lean()
        const userId = user._id.toString()
        const response = await requester.put(`/api/users/premium/${userId}`)
        expect(response.statusCode).to.be.eql(200)
    })

    it('[POST] /api/session/login - Should login an user', async()=>{
        const mockCredentials = {
            email: 'mock@premium.com',
            password: 'password'
        }

        const response = await requester.post('/api/session/login').send(mockCredentials)
        const cookieHeader = response.headers['set-cookie'][0]
        cookie = {
            name: cookieHeader.split('=')[0],
            value: cookieHeader.split('=')[1]
        }
        expect(response.statusCode).to.be.eql(302)
        expect(cookieHeader).to.be.ok
        expect(cookie.name).to.be.eql('mysession')
        expect(cookie.value).to.be.ok
    })


    it('[POST] /api/products - Should create a new product', async()=>{
        const mockProduct = {
            title: 'Mock Guitar',
            description: 'This guitar is actually imaginary',
            code: 'mockcode',
            price: 222,
            stock: 2,
            category: 'testing',
            status: true,
            thumbnails: []
        }

        const response = await requester.post('/api/products').send(mockProduct)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
        const product = await productModel.findOne({code: 'mockcode'})
        productId = product._id.toString()
        expect(response.statusCode).to.be.eql(201)
    })

    it('[PUT] api/carts/:cid/product/:pid - Should return 403 avoiding premium users to add their own products', async()=>{
        const response = await requester.put(`/api/carts/${cartId}/product/${productId}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
        const cart = await cartModel.findById(cartId)
        expect(cart.products.length).to.be.equal(0)
        expect(response.statusCode).to.be.eql(403)
        expect(response.body.description).to.be.eql('Can not add own products')
    })

    after(async() =>{
        await cartModel.findByIdAndDelete(cartId)
        await productModel.findByIdAndDelete(productId)
        await userModel.findOneAndDelete({ email: 'mock@premium.com'})
    })
})

