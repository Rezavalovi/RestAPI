const { Banner, Service, sequelize } = require("../models");
class BannerController {

    static async getAllBanner(req, res, next) {
        try {
            // Raw query to fetch all Banner data
            const bannerQuery = `
                SELECT banner_name, banner_image, description FROM "Banners"
            `;

            // Execute the raw query with replacements
            const dataBanner = await sequelize.query(bannerQuery, {
                type: sequelize.QueryTypes.SELECT
            });

            // Send response with banner data
            res.status(200).json({
                "status": 0,
                "message": "Sukses",
                "data": dataBanner
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllService(req, res, next) {
        try {
            // Extract email from user
            const { email } = req.user;

            // Raw query to fetch all Service data
            const serviceQuery = `
                SELECT service_code, service_name, service_icon, service_tarif 
                FROM "Services"
            `;

            // Execute the raw query with replacements
            const dataService = await sequelize.query(serviceQuery, {
                type: sequelize.QueryTypes.SELECT
            });

            // Send response with service data
            res.status(200).json({
                "status": 0,
                "message": "Sukses",
                "data": dataService
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BannerController