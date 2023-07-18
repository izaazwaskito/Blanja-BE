let {
  selectAllProduct,
  selectProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
  countData,
  findId,
  searchNameProduct,
} = require("../model/product");
//const createError = require('http-errors')
const commonHelper = require("../helper/common");
const client = require("../config/redis");
const cloudinary = require("../middlewares/cloudinary");
let productController = {
  getAllProduct: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 30;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id_product";
      const sort = req.query.sort || "ASC";
      const search = req.query.search || "";
      let result = await selectAllProduct({
        limit,
        offset,
        sort,
        sortby,
        search,
      });
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(
        res,
        result.rows,
        200,
        "Get Product Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },
  getDetailProduct: async (req, res) => {
    const id_product = Number(req.params.id);
    const { rowCount } = await findId(id_product);
    if (!rowCount) {
      return res.json({ message: "ID Not Found" });
    }
    selectProduct(id_product)
      .then((result) => {
        // client.setEx(
        //   `product/${id_product}`,
        //   60 * 60,
        //   JSON.stringify(result.rows)
        // );
        commonHelper.response(
          res,
          result.rows,
          200,
          "get data success from database"
        );
        // commonHelper.response(res,result.rows,200,"Get Product Detail Success");
      })
      .catch((err) => res.send(err));
  },
  createProduct: async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    const image_product = result.secure_url;
    const {
      id_category,
      name_product,
      price_product,
      description_product,
      stock_product,
    } = req.body;
    const {
      rows: [count],
    } = await countData();
    const id_product = Number(count.count) + 1;
    const data = {
      id_product,
      id_category,
      name_product,
      price_product,
      description_product,
      stock_product,
      image_product,
    };
    insertProduct(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create Product Success")
      )
      .catch((err) => res.send(err));
  },
  updateProduct: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      const image_product = result.secure_url;
      const id_product = Number(req.params.id);
      const {
        id_category,
        name_product,
        price_product,
        description_product,
        stock_product,
      } = req.body;
      const { rowCount } = await findId(id_product);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        id_product,
        id_category,
        name_product,
        price_product,
        description_product,
        stock_product,
        image_product,
      };
      updateProduct(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Product Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id_product = Number(req.params.id);
      const { rowCount } = await findId(id_product);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      deleteProduct(id_product)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Product Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  getNameProduct: async (req, res) => {
    try {
      const keywords = req.query.keywords || "";
      let result = await searchNameProduct({ keywords });
      commonHelper.response(res, result.rows, 200, "Serach Proudct Success");
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = productController;
