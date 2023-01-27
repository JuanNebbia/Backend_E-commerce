const socket = io()

const chatContainer = document.getElementById('chat-container')
const form = document.getElementById('chat-form')

socket.on('newMessage', data=>{
    chatContainer.innerHTML += `
    <div style="background-color: #a0a6f8; margin:1rem">
    <h2>${data.user}</h2>
    <p>${data.message}</p>
</div>`
})




//Envío de mensajes
form.addEventListener('submit', event =>{
    event.preventDefault()

    const formData = new FormData(form)
    const payload = new URLSearchParams(formData)

    const requestOptions = {
        method: 'POST',
        body: payload
    }
    fetch(form.action, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log(error))

    form.reset()
})

