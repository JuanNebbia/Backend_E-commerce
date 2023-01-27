const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
    const data = {name: "Juan", lastname: "Nebbia"}
    res.render('index', {})
})

router.get('/chat', (req, res) => {
    const data = {name: "Juan", lastname: "Nebbia"}
    res.render('chat', {})
})


module.exports = router