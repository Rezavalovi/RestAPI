require("dotenv").config()

const express = require('express')
const cors = require('cors')
const errorHandler = require('./middlewares/ErrorHandler')
const router = require('./routes')

const app = express()
const port = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use(router)
app.use(errorHandler)
app.use("./upload", express.static("upload"))


app.listen(port, () => {
    console.log(`SERVER CONNECTED!`)
})