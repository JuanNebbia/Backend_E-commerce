const createProduct = async(event) =>{
    event.preventDefault()
    const form = document.getElementById("product-form")
    const formData = new FormData(form)
    fetch('/api/products', {
        method: 'POST',
        body: formData,
        headers: {
            type: 'product-img'
        }
    })
    .then((response) => {
        if (response.ok) {
          alert('Producto creado exitosamente')
          document.location = '/'
        } else {
          alert("Error al enviar el formulario");
        }
      })
}