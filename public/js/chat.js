const socket = io()

const chatContainer = document.getElementById('chat-container')
const form = document.getElementById('chat-form')
const formUser = document.getElementById('user-input')
const cleanButton = document.getElementById('clean-button')

let user = prompt('insert your username')
form.innerHTML +=`<input type="text" value=${user} name="user" id="user-input"hidden>`

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

cleanButton.addEventListener('click', async event =>{
    const alert = confirm('Are you sure? \nThis action will delete all messages')
    if (alert) {
        fetch ('/api/chat',{method:'delete'})
    }
})

// Socket Listeners
socket.on('newMessage', data=>{
        chatContainer.innerHTML += `
        <div style="background-color: ${user === data.user? '#00ff00': '#0000ff' }; margin:1rem">
        <h2>${data.user}</h2>
        <p>${data.message}</p>
    </div>`
})

socket.on('cleanChat', data =>{
    chatContainer.innerHTML = ''
})