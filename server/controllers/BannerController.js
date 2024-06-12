const { Banner, Service } = require("../models");
class BannerController{

    static async getAllBanner(req, res, next){
        try {
            // Fetch all Banner data and set attributes
            const dataBanner = await Banner.findAll({
                attributes: ["banner_name", "banner_image", "description"]
            });
            // Send response with banner data
            res.status(200).json({
                "status": 0,
                "message": "Sukses",
                "data": dataBanner
            })
        } catch (error) {
            next(error);
        }
    }

    static async getAllService(req, res, next){
        try {
            // Fetch all Service data and set attributes
            const dataService = await Service.findAll({
                attributes: ["service_code", "service_name", "service_icon", "service_tarif"]
            });
            // Send response with service data
            res.status(200).json({
                "status": 0,
                "message": "Sukses",
                "data": dataService
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BannerController