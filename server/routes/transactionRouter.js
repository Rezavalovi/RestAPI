const TransactionController = require("../controllers/TransactionController");
const authentication = require("../middlewares/Authentication");


const transactionRouter = require("express").Router();

transactionRouter.get("/balance", authentication, TransactionController.getBalance)
transactionRouter.post("/topup", authentication, TransactionController.topUp)
transactionRouter.post("/transaction", authentication, TransactionController.transaction)
transactionRouter.get("/transaction/history", authentication, TransactionController.getHistoryTransaction)

module.exports = transactionRouter