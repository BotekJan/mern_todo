require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
const db = mongoose.connection
db.on('error', (error) => {
    console.error(error)
})
db.once('open', () => {
    console.log('connected to database')
})




const app = express()

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json())




const authRouter = require('./routes/auth')
app.use('/', authRouter)

const todosRouter = require('./routes/todos')
app.use('/todos', todosRouter)





app.listen(5000, () => {
    console.log(`server listening on port 5000`)
})
