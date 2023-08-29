const express = require("express");
const router = express.Router();
const sellerController = require("../controller/seller");
router
  .post("/register", sellerController.registerSeller)
  .post("/login", sellerController.loginSeller)
  .put("/update/:id", sellerController.updateSeller)
  .get("/profile", sellerController.getAllSeller)
  .get("/:id", sellerController.getDetailSeller);

module.exports = router;
