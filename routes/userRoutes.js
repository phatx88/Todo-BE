const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController");
const auth = require("../middlewares/auth");

userRouter.get("/me",auth.checkToken,userController.getCurrentUser);
userRouter.post("/register",userController.registerUser);
userRouter.post("/login",userController.loginUser);



module.exports = userRouter;
