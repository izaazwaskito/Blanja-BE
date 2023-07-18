const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const productController = require("../controller/product");
router
  .get("/", productController.getAllProduct)
  .get("/search", productController.getNameProduct)
  .get("/:id", productController.getDetailProduct)
  .post("/", upload, productController.createProduct)
  .put("/:id", upload, productController.updateProduct)
  .delete("/:id", productController.deleteProduct);

module.exports = router;
