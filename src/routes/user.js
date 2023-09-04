const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const uploaduser = require("../middlewares/uploaduser");
router
  .post("/register", userController.registerUser)
  .post("/login", userController.loginUser)
  .get("/verify", userController.VerifyAccount)
  .put("/photo/:id", uploaduser, userController.updateUserPhoto)
  .put("/update/:id", userController.updateUser)
  .get("/profile", userController.getAllUser)
  .get("/:id", userController.getDetailUser);

module.exports = router;
