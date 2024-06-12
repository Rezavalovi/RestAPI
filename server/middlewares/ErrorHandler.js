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
            message = "Username atau password salah";
            break;
        case "SequelizeValidationError":
        case "SequelizeUniqueConstraintError":
            status = 400;
            message = error.errors[0].message;
            break;
        case "InvalidToken":
            status = 108;
            message = "Token tidak valid atau kadaluwarsa";
            break;
        case "JsonWebTokenError":
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
    }

    res.status(status).json({
        status,
        message,
        data
    });
}

module.exports = errorHandler;
