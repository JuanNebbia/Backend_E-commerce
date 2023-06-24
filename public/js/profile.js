const changeRole = async(uid, status) =>{
    if(!status){
        return alert('Debe cargar la documentación para cambiar su rol a premium')
    }
    fetch(`/api/users/premium/${uid}`, {
        method: 'PUT'
    })
    .then(response => {
        if(response.status === 200){
            alert('Rol modificado exitosamente, reinicia sesión para ver los cambios.')
            window.location = window.location
        }else{
            alert('hubo un problema al cambiar el rol')
        }
    })
}

const sendDocumentation = async(event, uid) => {
    event.preventDefault()
    const fileOption = document.getElementById('doc-selec').value
    const formData = new FormData();
    const fileField = document.getElementById('file-input');
    formData.append("file", fileField.files[0]);
    if(!fileOption){
        return alert('seleccione el tipo de documento a cargar')
    }
    fetch(`/api/users/${uid}/documents`, {
        method: 'POST',
        body: formData,
        headers: {
            type: 'documents',
            doctype: fileOption
        }
    })
    .then(response => {
        if(response.status === 200){
            alert('documento cargado con éxito')
        }else{
            alert('hubo un problema al cargar el documento')
        }
    })
}

