const { User } = require("../models");
const { signToken } = require('../helpers/jwt');
const bcryptjs = require('bcryptjs');

class UserController {

    static async register(req, res, next) {
        try {
            // Extract user data from request body
            const { email, first_name, last_name, password } = req.body;

            // Create a new user in the database
            await User.create({ email, first_name, last_name, password });

            // Send successful registration response
            res.status(200).json({
                "status": 0,
                "message": "Registrasi berhasil silahkan login",
                "data": null
            })
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            // Extract email and password from request body
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({
                where: {
                    email
                }
            })

            // Check if user exists
            if (!user) {
                throw {
                    name: "Unauthorized",
                }
            }

            // Compare password using bcryptjs
            const isPasswordCorrect = bcryptjs.compareSync(password, user.password);

            // Check if password is correct
            if (!isPasswordCorrect) {
                throw {
                    name: "Unauthorized",
                }
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
            })
        } catch (error) {
            next(error);
        }
    }

    static async getProfileUser(req, res, next) {
        try {
            // Extract email from request
            const email = req.user.email;

            //  Retrieve user profile data using email
            let user = await User.findOne({
                where: {
                    email
                },
                attributes: ["email", "first_name", "last_name", "profile_image"]
            });

            // Send response with user profile data
            res.status(200).json({
                "status": 0,
                "message": "Sukses",
                "data": user
            })
        } catch (error) {
            next(error);
        }
    }

    static async updateProfile(req, res, next) {
        try {
            // Extract email from request and user data from body
            const email = req.user.email;
            let { first_name, last_name } = req.body;

            //Updating user profiles using email search criteria
            await User.update({
                first_name, last_name
            }, {
                where: { email: email }
            });

            // Retrieving updated user profile data
            let userProfile = await User.findOne({
                where: {
                    email: email
                },
                attributes: ["email", "first_name", "last_name", "profile_image"]
            });

            //  Send response with updated user profile data
            res.status(200).json({
                "status": 0,
                "message": "Update Profile berhasil",
                "data": userProfile
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateProfileImage(req, res, next) {
        try {
            // Extract the user's email from the request
            const email = req.user.email;

            // Check if an image file was uploaded
            if (!req.file) {
                return res.status(400).json({ message: 'No image uploaded' }); 
            }

            // Get the uploaded image file path from the request
            const imagePath = req.file.path;

            // Update the user's profile image URL in the database
            await User.update({ profile_image: imagePath }, { where: { email: email } });

            // Fetch the updated user data from the database
            const updatedUser = await User.findOne({ where: { email: email }, attributes: ["email", "first_name", "last_name", "profile_image"] });

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