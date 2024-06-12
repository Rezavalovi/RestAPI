// const { verifyToken } = require("../helpers/jwt");
// const { User } = require("../models");

// module.exports = async function authentication(req, res, next) {
//     try {
//         let token = req.headers.authorization
//         if (!token) {
//             throw { name: "Invalid token" }
//         }
//         if (token.slice(0, 7) !== "Bearer ") {
//             throw { name: "Invalid token" }
//         }
//         token = token.slice(7)
//         let payload = verifyToken(token)
//         let user = await User.findOne(payload.user.email)
//         if (!user) {
//             return res.status(108).json({ message: "Token tidak tidak valid atau kadaluwarsa" });
//         }
//         req.user = {
//             email: user.email
//         }
//         next()
//     } catch (error) {
//         next(error)
//     }
// }

const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = async function authentication(req, res, next) {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return next({ name: "InvalidToken" });
        }
        if (token.slice(0, 7) !== "Bearer ") {
            return next({ name: "InvalidToken" });
        }
        token = token.slice(7);
        let payload;
        try {
            payload = verifyToken(token);
        } catch (error) {
            return next({ name: "InvalidToken" });
        }

        let user = await User.findOne({ where: { email: payload.email } });
        if (!user) {
            return next({ name: "InvalidToken" });
        }
        req.user = {
            email: user.email
        };
        next();
    } catch (error) {
        next(error);
    }
}

