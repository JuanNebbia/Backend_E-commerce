class GetProductDTO{
    constructor(payload){
        this.id = payload._id
        this.title = payload.title
        this.description = payload.description
        this.code = payload.code
        this.price = payload.price
        this.stock = payload.stock
        this.category = payload.category
        this.status = payload.status
    }
}


class AddProductDTO {
    constructor(payload){
        this.title = payload.title
        this.description = payload.description
        this.code = payload.code
        this.price = payload.price
        this.stock = payload.stock
        this.category = payload.category
        this.status = payload.stock > 0 ? true : false
    }
}


module.exports = {
    GetProductDTO,
    AddProductDTO
}