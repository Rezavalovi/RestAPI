const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/Authentication");
const upload = require("../middlewares/UploadImage");
const userRouter = require("express").Router();

const uploadMiddleware = upload();

userRouter.post('/registration', UserController.register);
userRouter.post('/login', UserController.login);

userRouter.put("/profile/image", authentication, uploadMiddleware.single("profile_image"), UserController.updateProfileImage);

userRouter.get('/profile', authentication, UserController.getProfileUser);
userRouter.put('/profile/update', authentication, UserController.updateProfile);

module.exports = userRouter;
