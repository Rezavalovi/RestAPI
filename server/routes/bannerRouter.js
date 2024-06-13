const BannerController = require("../controllers/BannerController");
const authentication = require("../middlewares/Authentication");

const bannerRouter = require("express").Router();

bannerRouter.get("/banner", BannerController.getAllBanner)
bannerRouter.get("/services", authentication, BannerController.getAllService)

module.exports = bannerRouter