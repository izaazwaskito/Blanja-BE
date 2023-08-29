const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let {
  insertSeller,
  findEmail,
  selectAllSeller,
  updateSeller,
  countData,
  selectSeller,
  findId,
} = require("../model/seller");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");

let sellerController = {
  getAllSeller: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id_seller";
      const sort = req.query.sort || "ASC";
      let result = await selectAllSeller({ limit, offset, sort, sortby });
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
        "Get Seller Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getDetailSeller: async (req, res) => {
    const id_seller = String(req.params.id);
    const { rowCount } = await findId(id_seller);
    if (!rowCount) {
      return res.json({ message: "ID Not Found" });
    }
    selectSeller(id_seller)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get Seller Detail Success"
        );
      })
      .catch((err) => res.send(err));
  },

  registerSeller: async (req, res) => {
    let {
      name_seller,
      email_seller,
      password_seller,
      store_seller,
      description_seller,
      phone_seller,
    } = req.body;
    const { rowCount } = await findEmail(email_seller);
    if (rowCount) {
      return res.json({ message: "Email Already Taken" });
    }
    const passwordHash_seller = bcrypt.hashSync(password_seller);
    const id_seller = uuidv4();

    const data = {
      id_seller,
      name_seller,
      store_seller,
      email_seller,
      passwordHash_seller,
      description_seller,
      phone_seller,
    };
    insertSeller(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create User Success")
      )
      .catch((err) => res.send(err));
  },
  loginSeller: async (req, res) => {
    const { email_seller, password_seller } = req.body;
    const {
      rows: [seller],
    } = await findEmail(email_seller);
    if (!seller) {
      return res.json({ message: "Email Wrong" });
    }
    const isValidPassword = bcrypt.compareSync(
      password_seller,
      seller.password_seller
    );
    if (!isValidPassword) {
      return res.json({ message: "Password Wrong" });
    }
    delete seller.password_seller;
    const payload = {
      email_seller: seller.email_seller,
      role_seller: seller.role_seller,
    };
    seller.token_user = authHelper.generateToken(payload);
    seller.refreshToken = authHelper.generateRefreshToken(payload);
    commonHelper.response(res, seller, 201, "Login Successfuly");
  },

  updateSeller: async (req, res) => {
    try {
      const id_seller = String(req.params.id);
      const { store_seller, email_seller, phone_seller, description_seller } =
        req.body;
      const data = {
        id_seller,
        store_seller,
        email_seller,
        phone_seller,
        description_seller,
      };
      updateSeller(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Product Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  profileUser: async (req, res) => {
    const email_user = req.payload.email_user;
    const {
      rows: [user],
    } = await findEmail(email_user);
    delete user.password_user;
    commonHelper.response(res, user, 200);
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      email_seller: decoded.email_seller,
      role_seller: decoded.role_seller,
    };
    const result = {
      token_user: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200);
  },
};

module.exports = sellerController;
