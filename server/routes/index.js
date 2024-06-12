const userRouter = require('./userRouter');
const bannerRouter = require('./bannerRouter');

const router = require("express").Router();

router.use("/", userRouter);
router.use("/", bannerRouter);

module.exports = router;