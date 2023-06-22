const deleteUser = async(id) =>{
    fetch(`/api/users/${id}`,{
        method: 'DELETE'
    })
    .then(() => alert('Usuario eliminado'))
    .then(response => console.log(response))
}

const changeRole = async(id) =>{
    fetch(`/api/users/premium/${id}`,{
        method: 'PUT'
    })
    .then((response) => {
        if(response.status === 200){
            alert('Usuario modificado')
        }else{
            alert('No se puede modificar este usuario')
        }
    })
}

const deleteInactive = async() =>{
    fetch(`/api/users`,{
        method: 'DELETE'
    })
    .then((response) => {
        if(response.status === 200){
            alert('Usuarios eliminados')
        }else{
            alert('Ha habido un problema al eliminar usuarios')
        }
    })
}