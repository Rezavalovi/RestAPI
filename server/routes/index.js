const userRouter = require('./userRouter');

const router = require("express").Router();

router.use("/", userRouter);

module.exports = router;