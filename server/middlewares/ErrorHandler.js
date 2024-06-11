const errorHandler = (error, req, res, next) => {
    console.log(error.message);
    let status = error.status || 500
    let message = error.message || "Internal server error"

    switch (error.name) {
        case "BadRequest":
            status = 400
            break;
        case "Unauthorized":
            status = 401
            message = "Unauthorized"
            break;
        case "SequelizeValidationError":
        case "SequelizeUniqueConstraintError":
            status = 400
            message = error.errors[0].message
            break;
        case "InvalidToken":
        case "JsonWebTokenError":
            status = 401
            message = "Invalid token"
            break;
        case "Forbidden":
            status = 403
            message = "You are not authorized"
            break;
        case "NotFound":
            status = 404
            message = "Hero Not Found"
            break;
    }
    res.status(status).json({
        message
    })
}

module.exports = errorHandler