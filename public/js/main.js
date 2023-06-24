const logoutButton = document.getElementById('logout-button')

logoutButton?.addEventListener('click', ()=>{
    fetch('/api/session/logout')
    .then(() => window.location.href = '/')
})

const seeProfile = (uid) =>{
    window.location.href = `/profile/${uid}`
}

const seeCart = async (event, cid) =>{
    window.location.href = `/cart/${cid}`
}