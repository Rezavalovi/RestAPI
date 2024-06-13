const userRouter = require('./userRouter');
const bannerRouter = require('./bannerRouter');
const transactionRouter = require('./transactionRouter');

const router = require("express").Router();

router.use("/", transactionRouter);
router.use("/", userRouter);
router.use("/", bannerRouter);

module.exports = router;