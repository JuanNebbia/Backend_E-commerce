const filterResults = async(event, filter) => {
    if(filter){
        window.location.href = '/products?query=' + filter
    }else{
        window.location.href = '/products'
    }
}

const seeProduct = async (event, pid) => {
    window.location.href = '/product/' + pid
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