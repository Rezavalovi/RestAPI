const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = async function authentication(req, res, next) {
    try {

        let token = req.headers.authorization;

        if (!token) {
            throw ({
                status: 401,
                message: "Token tidak  valid atau kadaluwarsa"
            });
        }
        if (token.slice(0, 7) !== "Bearer ") {
            throw ({ status: 401, message: "Token tidak valid atau kadaluwarsa" });
        }
        token = token.slice(7);
        let payload;
        try {
            payload = verifyToken(token);
        } catch (error) {
            throw ({ status: 401, message: "Token tidak valid atau kadaluwarsa" });
        }

        let user = await User.findOne({ where: { email: payload.email } });
        if (!user) {
            throw ({ status: 401, message: "Token tidak valid atau kadaluwarsa" });
        }
        req.user = {
            email: user.email
        };

        next();
    } catch (error) {
        next(error);
    }
}

