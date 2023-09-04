const express = require("express");
const router = express.Router();
const sellerController = require("../controller/seller");
const uploadseller = require("../middlewares/uploadseller");
router
  .post("/register", sellerController.registerSeller)
  .post("/login", sellerController.loginSeller)
  .get("/verify", sellerController.VerifyAccount)
  .put("/update/:id", sellerController.updateSeller)
  .put("/photo/:id", uploadseller, sellerController.updateSellerPhoto)
  .get("/profile", sellerController.getAllSeller)
  .get("/:id", sellerController.getDetailSeller);

module.exports = router;
