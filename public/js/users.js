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
        console.log(response)
        if(response.code === 200){
            alert('Usuario modificado')
        }else{
            alert('No se puede modificar este usuario')
        }
    })
}