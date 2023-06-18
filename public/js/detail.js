const decreaseAmount = (event) =>{
    const amount = + event.target.nextElementSibling.textContent
    if (amount > 1){
        event.target.nextElementSibling.textContent = amount - 1
    }
}

const increaseAmount = (event, stock) =>{
    const amount = +event.target.previousElementSibling.textContent
    if(amount < stock){
        event.target.previousElementSibling.textContent = amount + 1
    }
}

const addToCart = async (event, pid, cid) =>{
    try {        
        const amount = event.target.previousElementSibling.children[1].textContent
        const addedProduct = await fetch(`/api/carts/${cid}/product/${pid}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({amount}),
        })
        if (addedProduct.status == 200){
            alert('item added to cart')
        }else{
            alert("Can't add product to cart")
        }
        event.target.previousElementSibling.children[1].textContent = 1
        
    } catch (error) {
        console.log(error);
    }
}