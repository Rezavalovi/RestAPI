const express = require('express')

const errorHandler = require('./middlewares/ErrorHandler')
const router = require('./routes')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(errorHandler)
app.use(router)

app.listen(port, () => {
    console.log(`Server Jalan di ${port}`)
})