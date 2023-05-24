const { expect } = require('chai')
const supertest = require('supertest')
const productModel = require('../../src/models/schemas/product.model.js')
const userModel = require('../../src/models/schemas/user.model.js')

const requester = supertest('http://127.0.0.1:8080')

describe('Products routes testing for unauthenticated users', async() => {

    it('[POST] /api/products - Should return a code 401 for unauthenticated users', async()=>{
        const mockProduct = {
            title: 'Mock Guitar',
            description: 'This guitar is actually imaginary',
            code: 'mockcode',
            price: 222,
            stock: 2,
            category: 'testing',
            status: true,
            thumbnails: [],
            owner: 'admin'
        }

        const response = await requester.post('/api/products').send(mockProduct)
        expect(response.statusCode).to.be.eql(401)
    })
})

describe('Products routes testing for user with USER role', async() => {
    let cookie
    
    it('[POST] /api/session/register - Should register a user and redirect', async function(){
        const mockUser = {
            firstName: 'Mock',
            lastName: 'User',
            age: 25,
            email: 'mock@user.com',
            password: 'password'
        }
        const response = await requester.post('/api/session/register').send(mockUser)
        expect(response.statusCode).to.be.eql(302)
        expect(response.request._data.email).to.be.eql(mockUser.email)
    })
    
    it('[POST] /api/session/login - Should login an user', async()=>{
        const mockCredentials = {
            email: 'mock@user.com',
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

    it('[GET] /api/session/current - Should return current logged user with USER role', async() => {
        const response = await requester.get('/api/session/current')
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
        expect(response.statusCode).to.be.eql(200)    
        expect(response.body.payload.email).to.be.eql('mock@user.com')
        expect(response.body.payload.role).to.be.eql('user')
    })

    it('[POST] /api/products - Should return a 403 status', async()=>{
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
        expect(response.statusCode).to.be.eql(403)
    })

    after(async() => {
        await userModel.findOneAndDelete({ email: 'mock@user.com'})
    })
})


describe('Products routes testing for user with PREMIUM role', async() => {
    let cookie
    
    it('[POST] /api/session/register - Should register a user and redirect', async function(){
        const mockUser = {
            firstName: 'Mock',
            lastName: 'Premium',
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

    it('[GET] /api/session/current - Should return current logged user with PREMIUM role', async() => {
        const response = await requester.get('/api/session/current')
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
        expect(response.statusCode).to.be.eql(200)    
        expect(response.body.payload.email).to.be.eql('mock@premium.com')
        expect(response.body.payload.role).to.be.eql('premium')
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
        expect(response.statusCode).to.be.eql(201)
    })

    it('[DELETE] /api/products/:pid - Should delete a product', async()=>{
        const product = await productModel.findOne({code: 'mockcode'}).lean()
        const productId = product._id.toString()
        const response = await requester.delete(`/api/products/${productId}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
        const deletedProduct = await productModel.findOne({code: 'mockcode'}).lean()
        expect(response.statusCode).to.be.eql(200)
        expect(deletedProduct).to.be.eql(null)
    })

    after(async() => {
        await userModel.findOneAndDelete({ email: 'mock@premium.com'})
        await productModel.findOneAndDelete({ code: 'mockcode'})
    })
})