const form = document.getElementById('new-password-form')

const showError = (messsage) =>{
    const errorTag = document.createElement('div');
    errorTag.classList.add('error-message');
    errorTag.textContent = messsage;
    form.parentElement.parentElement.appendChild(errorTag)
}

const showRedirectButton = () =>{
    const redirectButton = document.createElement('button')
    redirectButton.innerHTML = `
    <a href='/login/recover'>Nuevo correo</a>
    `
    form.parentElement.parentElement.appendChild(redirectButton)
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    const payload = new URLSearchParams(formData)
    const requestOptions = {
        method: 'PUT',
        body: payload
    }
    fetch('/api/users/generatenewpassword', requestOptions)
    .then(response => {
        switch (response.status) {
            case 200:
                alert("la contraseña se cambió con éxito");
                window.location = '/'
                break;
            case 400:
                showError('La contraseña no puede ser idéntica a la anterior. Por favor, escoga una nueva.')
                break;
            case 403:
                showError('El token ha expirado, haga click abajo para mandar un nuevo correo')
                showRedirectButton()
                break;
            default:
                break;
        }
    })
    .catch(error => console.log(error))
})