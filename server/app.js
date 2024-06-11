const express = require('express')

const errorHandler = require('./middlewares/ErrorHandler')
const router = require('./routes')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(errorHandler)
app.use(router)
app.use(errorHandler)

//endpoint users
// app.post('/register', userController.register)
// app.post('/login', userController.login)
// app.get('/profile', userController.getUserProfile)
// app.put('/profile/:id', userController.updateUserProfile)
// app.put('/profile/image', userController.updateImage)
// app.put('/profile/image', userController.patchEditById)


//endpoint information
// app.get('/banner', informationController.getAllBanner)
// app.get('/services', informationController.getAllService)


//endpoint translation
// app.get('/balance', authentication, transactionController.getAllBalance)
// app.get('/transaction/history', authentication, transactionController.getTransactionHistory)
// app.post('/topup/:id', authentication, transactionController.topup)
// app.put('/transaction/:id', authentication, transactionController.transactions)


app.listen(port, () => {
    console.log(`Server Jalan di ${port}`)
})