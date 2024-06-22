const express = require("express");
const Router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");

//user controller

const { register, login, checkUser } = require("../Controller/userController");
//register route
Router.post("/register", register);
Router.post("/login", login);
Router.get("/check",authMiddleware,checkUser); 

module.exports = Router;
