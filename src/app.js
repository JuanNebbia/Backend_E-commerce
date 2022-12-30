const express = require('express')
const apiRoutes = require('./routers/app.routers')
const path = require('path')

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use('/statics', express.static(path.resolve(__dirname, '../public')))
app.use('/api', apiRoutes)


app.listen(PORT, ()=>{
    console.log('Listening on port => ', PORT)
})