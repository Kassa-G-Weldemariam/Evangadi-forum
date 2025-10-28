const express = require("express");
const { register, login, checkUser } = require("../controller/userController");
const route = express.Router();
//authentication middleware
const { authMiddleware } = require("../middleware/authMiddleware");

//register route
route.post("/register", register);

//login user route
route.post("/login", login);

// check user route
route.get("/check", authMiddleware, checkUser);

module.exports = route;
