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
            alert('Producto añadido al carrito')
        }else{
            alert("No se ha podido añadir el producto.")
        }
        event.target.previousElementSibling.children[1].textContent = 1
        
    } catch (error) {
        console.log(error);
    }
}

const selectImg = (name) =>{
    const img = document.querySelector('.product-img')
    img.src = `../../statics/products/${name}`
}

const deleteItem = (pid) =>{      
    fetch(`/api/products/${pid}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok){
            alert('producto eliminado exitosamente')
            window.location = '/'
        }else{
            alert("No se pudo eliminar el producto, vuelva a intentar")
        }

    })
}