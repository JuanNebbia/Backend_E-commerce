class GetTicketDTO {
    constructor(payload){
        this.code = payload.code
        this.date = payload.purchase_datetime
        this.amount = payload.amount
        this.purchaser = payload.purchaser
        this.products = payload.products
    }
}

class AddTicketDTO {
    constructor(purchaser, amount, products){
        this.products = products
        this.purchaser = purchaser.email
        this.amount = amount
        this.purchase_datetime = new Date()
        //UUID =>
        this.code = `${Math.floor(Math.random()*1e10)}`
    }
}

module.exports = {
    GetTicketDTO,
    AddTicketDTO
}