const productItem = document.querySelector('.product-item')
const addToCartButton = document.getElementById('add-to-cart-button')


const addToCart = (event) =>{
    productId = event.target.parentNode.getAttribute('id')
    fetch(`/api/carts/63d340c23d5c79f55cef8b6d/product/${productId}`, {
        method: 'POST'
    })
    .then(alert('item added to cart'))
}