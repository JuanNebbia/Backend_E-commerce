const getDaos = require('../models/daos/factory')
const HTTP_STATUS = require ("../constants/api.constants.js")
const { apiSuccessResponse } = require("../utils/api.utils.js");
const HttpError = require("../utils/error.utils");
const UsersService = require('../services/users.service.js');

const usersService = new UsersService()

class UsersController{

    static async getAll(req, res, next) {
        try {
            const users = await usersService.getAll()
            const response = apiSuccessResponse(users)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        const { uid } = req.params
        try {
            const user = await usersService.getById(uid)
            const response = apiSuccessResponse(user)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async addUser(req, res, next) {
        const payload = req.body
        const { file } = req
        try {
            const newUser = await usersService.createUser(payload, file)
            const response = apiSuccessResponse(newUser)
            return res.status(HTTP_STATUS.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async updateUser(req, res, next){
        const { uid } = req.params
        const payload = req.body
        try {
            const updatedUser = await usersService.updateUser(uid, payload)
            const response = apiSuccessResponse(updatedUser)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async deleteUser(req, res, next){
        const { uid } = req.params
        try {
            const deletedUser = await usersService.deleteUser(uid)
            const response = apiSuccessResponse(deletedUser)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }    
}

module.exports = UsersController