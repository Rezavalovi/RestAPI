const { User, sequelize } = require("../models");
const { signToken } = require('../helpers/jwt');
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const remove = require("../helpers/removeFile");
const fs = require('fs').promises;

class UserController {

    static async register(req, res, next) {
        try {
            // Extract user data from request body
            const { email, first_name, last_name, password } = req.body;

            // Create instance model user for validation
            const userInstance = User.build({ email, first_name, last_name, password });

            // Run manual validation
            await userInstance.validate();

            // Hash password after validation success
            const hashedPassword = hashPassword(password);

            // Raw query to create a new user in the database
            const query = `
                INSERT INTO "Users" (email, first_name, last_name, password, "createdAt", "updatedAt")
                VALUES (:email, :first_name, :last_name, :password, NOW(), NOW())
            `;

            // Execute the raw query with replacements
            await sequelize.query(query, {
                replacements: {
                    email,
                    first_name,
                    last_name,
                    password: hashedPassword
                },
                type: sequelize.QueryTypes.INSERT
            });

            // Send successful registration response
            res.status(200).json({
                "status": 0,
                "message": "Registrasi berhasil silahkan login",
                "data": null
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const message = error.errors.map(e => e.message).join(', ');
                res.status(400).json({
                    "status": 102,
                    "message": message,
                    "data": null
                });
            } else {
                next(error);
            }
        }
    }

    static async login(req, res, next) {
        try {
            // Extract email and password from request body
            const { email, password } = req.body;

            // Create instance model user for validation
            const userInstance = User.build({ email, password });

            // Run manual validation
            await userInstance.validate({ fields: ['email'] });

            // Raw query to find user by email
            const userQuery = `
                SELECT * FROM "Users"
                WHERE email = :email
            `;

            // Execute the raw query with replacements
            const users = await sequelize.query(userQuery, {
                replacements: { email },
                type: sequelize.QueryTypes.SELECT
            });

            // Check if user exists
            if (users.length === 0) {
                return res.status(401).json({
                    "status": 103,
                    "message": "Username atau password salah",
                    "data": null
                });
            }

            const user = users[0];

            // Compare password using bcryptjs
            const isPasswordCorrect = comparePassword(password, user.password);

            // Check if password is correct
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    "status": 103,
                    "message": "Username atau password salah",
                    "data": null
                });
            }

            // Generate access token
            const accessToken = signToken({ email: user.email });

            // Send successful login response with access token
            res.status(200).json({
                "status": 0,
                "message": "Login Sukses",
                "data": {
                    "token": accessToken
                }
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const message = error.errors.map(e => e.message).join(', ');
                res.status(400).json({
                    "status": 102,
                    "message": message,
                    "data": null
                });
            } else {
                next(error);
            }
        }
    }

    static async getProfileUser(req, res, next) {
        try {
            // Extract email from request 
            const { email } = req.user;
    
            // Create instance model user for validation
            const userInstance = User.build({ email });
    
            // Run manual validation
            await userInstance.validate({ fields: ['email'] });
    
            // Raw query to retrieve user profile data using email
            const userQuery = `
                SELECT email, first_name, last_name, profile_image FROM "Users"
                WHERE email = :email
            `;
    
            // Execute the raw query with replacements
            const users = await sequelize.query(userQuery, {
                replacements: { email },
                type: sequelize.QueryTypes.SELECT
            });
    
            // Send response with user profile data
            res.status(200).json({
                "status": 0,
                "message": "Sukses",
                "data": users
            });
        } catch (error) {
            next(error); // Pass the error to the error handler middleware
        }
    }

    static async updateProfile(req, res, next) {
        try {
            // Extract email from request and user data from body
            const email = req.user.email;
            let { first_name, last_name } = req.body;
    
            // Create instance validation email
            const userInstance = User.build({ email });
    
            // Run manual validation
            await userInstance.validate({ fields: ['email'] });
    
            // Raw query to update user profiles using email search criteria
            const updateQuery = `
                UPDATE "Users"
                SET first_name = :first_name, last_name = :last_name, "updatedAt" = NOW()
                WHERE email = :email
            `;
    
            // Execute the raw query with replacements
            await sequelize.query(updateQuery, {
                replacements: { email, first_name, last_name },
                type: sequelize.QueryTypes.UPDATE
            });
    
            // Raw query to retrieve updated user profile data
            const userQuery = `
                SELECT email, first_name, last_name, profile_image FROM "Users"
                WHERE email = :email
            `;
    
            // Execute the raw query with replacements
            const users = await sequelize.query(userQuery, {
                replacements: { email },
                type: sequelize.QueryTypes.SELECT
            });
        
            // Send response with updated user profile data
            res.status(200).json({
                "status": 0,
                "message": "Update Profile berhasil",
                "data": users
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({
                    "status": 108,
                    "message": "Parameter email tidak sesuai format",
                    "data": null
                });
            } else if (error.name === 'InvalidToken') {
                res.status(401).json({
                    "status": 108,
                    "message": "Token tidak tidak valid atau kadaluwarsa",
                    "data": null
                });
            } else {
                next(error);
            }
        }
    }

    static async updateProfileImage(req, res, next) {
        try {
            // Extract the user's email from the request
            const { email } = req.user;
    
            // Fetch the updated user data from the database
            const userQuery = `
                SELECT email, first_name, last_name, profile_image FROM "Users"
                WHERE email = :email
            `;
            const users = await sequelize.query(userQuery, {
                replacements: { email },
                type: sequelize.QueryTypes.SELECT
            });
    
            if (users.length === 0) {
                const error = new Error("Token tidak valid atau kadaluwarsa");
                error.name = "InvalidToken";
                throw error;
            }
    
            const updatedUser = users[0];
    
            // Check if an image file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    message: 'No image uploaded',
                    data: null
                });
            }
    
            // Get the uploaded image file path from the request
            const imagePath = req.file.path;
    
            // Validate image format
            const validImageFormats = /\.(jpeg|jpg|png)$/i;
            if (!validImageFormats.test(imagePath)) {
                await fs.unlink(imagePath); // Delete the invalid uploaded file
                return res.status(400).json({
                    status: 102,
                    message: 'Format Image tidak sesuai',
                    data: null
                });
            }
    
            // Remove the old profile image if it exists
            if (updatedUser.profile_image) {
                await fs.unlink(updatedUser.profile_image).catch(err => console.error(`Failed to delete old profile image: ${err}`));
            }
    
            // Update the user's profile image URL in the database
            const updateQuery = `
                UPDATE "Users"
                SET profile_image = :profile_image
                WHERE email = :email
            `;
            await sequelize.query(updateQuery, {
                replacements: { profile_image: imagePath, email: email },
                type: sequelize.QueryTypes.UPDATE
            });
    
            // Send a successful response with a message and the updated user data
            res.status(200).json({
                status: 0,
                message: "Update Profile Image berhasil",
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = UserController;