const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
router
  .post("/register", userController.registerUser)
  .post("/login", userController.loginUser)
  .get("/profile", userController.profileUser);

module.exports = router;
