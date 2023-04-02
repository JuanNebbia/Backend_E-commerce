const HTTP_STATUS = require("../constants/api.constants.js");
const getDaos = require("../models/daos/factory.js");
const { logYellow } = require("../utils/console.utils.js");
const HttpError = require("../utils/error.utils.js");

const { ticketsDao, cartsDao, productsDao } = getDaos()

class TicketsService {
    async getTickets() {
        const tickets = await ticketsDao.getAll()
        return tickets
    }

    async getTicketById(tid) {
        if(!tid){
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        }
        const ticket = await ticketsDao.getById(tid)
        if(!ticket){
            throw new HttpError('Ticket not found', HTTP_STATUS.NOT_FOUND)
        }
        return ticket
    }

    async createTicket(cid, payload){
        if(!cid){
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        }
        if(!Object.keys(payload).length){
            throw new HttpError('Missing products', HTTP_STATUS.BAD_REQUEST)
        }
        payload.totalPrice = 0
        await payload.forEach( async item => {
            if(item.quantity > item.product.stock){
                logYellow(`Not enough stock for this item ${item.product.title} with id: ${item.product._id}`);
                notSold.push(item)
            }else{
                payload.totalPrice += item.quantity * item.product.price
                await cartsDao.deleteProductFromCart(cid, item.product._id)
                const updateProductPayload = {}
                updateProductPayload.stock = item.product.stock - item.quantity
                if (updateProductPayload.stock === 0){
                    updateProductPayload.status = false
                }
                await productsDao.updateById(item.product._id, updateProductPayload)
                logYellow(`Item ${item.product.title} deleted from cart: ${cid}`);
            }
        })
        const amount = payload.totalPrice
        if(!amount){
            throw new HttpError('Not enough stock for purchase any product', HTTP_STATUS.BAD_REQUEST)
        }
        const fullPayload = {
            purchaser: 'Eusbio',
            purchase_datetime: new Date(),
            code: `${Math.floor(Math.random()*1e8)}`,
            amount
        }
        const newTicket = await ticketsDao.create(fullPayload)
        return newTicket
    }

    async updateTicket(tid, payload){
        if(!tid || !payload || !Object.keys(payload).length){
            throw HttpError('Please provide an id and a payload for the ticket', HTTP_STATUS.BAD_REQUEST)
        }
        const ticket = await ticketsDao.getById(tid)
        if(!ticket){
            throw new HttpError('Ticket not found', HTTP_STATUS.NOT_FOUND)
        }
        const updatedTicket = await ticketsDao.updateById(tid, payload)
        return updatedTicket
    }

    async deleteTicket(tid){
        if(!tid){
            throw HttpError('Please specify a ticket ID', HTTP_STATUS.BAD_REQUEST)
        }
        const deletedTicket = await ticketsDao.delete(tid)
        return deletedTicket
    }
}

module.exports = TicketsService