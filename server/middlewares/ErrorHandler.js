const errorHandler = (error, req, res, next) => {
    console.log(error.message);
    let status = error.status || 500;
    let message = error.message || "Internal server error";
    let data = null;

    switch (error.name) {
        case "BadRequest":
            status = 400;
            break;
        case "Unauthorized":
            status = 401;
            message = "Token tidak valid atau kadaluwarsa";
            break;
        case "SequelizeValidationError":
        case "SequelizeUniqueConstraintError":
            status = 400;
            message = error.errors[0].message;
            break;
        case "InvalidToken":
        case "JsonWebTokenError":
        case "TokenExpiredError":
            status = 108;
            message = "Token tidak valid atau kadaluwarsa";
            break;
        case "Forbidden":
            status = 403;
            message = "You are not authorized";
            break;
        case "NotFound":
            status = 404;
            message = "User Not Found";
            break;
        case "Service atau Layanan tidak ditemukan":
            status = 102;
            message = "Service atau Layanan tidak ditemukan";
            break;
        default:
            if (error.message === "invalid signature") {
                status = 108;
                message = "Token tidak valid atau kadaluwarsa";
            }
            break;
    }

    res.status(status).json({
        status,
        message,
        data
    });
};

module.exports = errorHandler;

