const BannerController = require("../controllers/BannerController");

const bannerRouter = require("express").Router();

bannerRouter.get("/banner", BannerController.getAllBanner)
bannerRouter.get("/services", BannerController.getAllService)

module.exports = bannerRouter