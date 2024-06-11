const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = async function authentication(req, res, next) {
    try {
        let token = req.headers.authorization
        if (!token) {
            throw { name: "Invalid token" }
        }
        if (token.slice(0, 7) !== "Bearer ") {
            throw { name: "Invalid token" }
        }
        token = token.slice(7)
        let payload = verifyToken(token)
        let user = await User.findByPk(payload.id)
        if (!user) {
            throw { name: "Invalid token" }
        }
        req.user = {
            id: user.id,
        }
        next()
    } catch (error) {
        next(error)
    }
}