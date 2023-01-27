const express = require('express')
const apiRoutes = require('./routers/app.routers')
const path = require('path')
const handlebars = require('express-handlebars')
const viewsRoutes = require('./routers/views/views.routes')
const { Server } = require('socket.io')
require('./config/dbConfig')

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use('/statics', express.static(path.resolve(__dirname, '../public')))
app.use('/api', apiRoutes)
app.use('/views', viewsRoutes)

app.engine('handlebars', handlebars.engine())
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'handlebars');

const httpServer = app.listen(PORT, ()=>{
    console.log('Listening on port => ', PORT)
})

const io = new Server(httpServer)

const messages = {user: "juanito", message: "Hola primo"}

io.on('connection', (socket)=>{
    console.log("new client connected");
    app.set('socket', socket)
})