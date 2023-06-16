const productItem = document.querySelector('.product-item')
const addToCartButton = document.getElementById('add-to-cart-button')
const seeCartButton = document.querySelector('.see-cart-button')

const cartId = seeCartButton.id

const seeProduct = async (event) => {
    let id
    let currentNode = event.target
    while (!id) {
        if(currentNode.tagName !== 'A'){
            currentNode = currentNode.parentNode
        }else{
            id = currentNode.id
            break
        }
    }
    window.location.href = '/product/' + id
}

const seeCart = async (event) =>{
    window.location.href = `/cart/${cartId}`
}

const decreaseAmount = (event) =>{
    const amount = + event.target.nextElementSibling.textContent
    if (amount > 1){
        event.target.nextElementSibling.textContent = amount - 1
    }
}

const increaseAmount = (event) =>{
    const stock = +event.target.parentNode.parentNode.previousElementSibling.textContent.split(' ')[0]
    const amount = +event.target.previousElementSibling.textContent
    if(amount < stock){
        event.target.previousElementSibling.textContent = amount + 1
    }
}