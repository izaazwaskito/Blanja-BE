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
  createSellerVerification,
  checkSellerVerification,
  cekSeller,
  deleteSellerVerification,
  updateAccountVerification,
  updateSellerPhoto,
} = require("../model/seller");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const sendemailseller = require("../middlewares/sendemailseller");
const crypto = require("crypto");
const cloudinary = require("../middlewares/cloudinary");

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
    const checkEmail = await findEmail(email_seller);
    try {
      if (checkEmail.rowCount == 1) throw "Email already used";
      // delete checkEmail.rows[0].password;
    } catch (error) {
      delete checkEmail.rows[0].password;
      return commonHelper.response(res, null, 403, error);
    }

    const passwordHash_seller = bcrypt.hashSync(password_seller);
    const id_seller = uuidv4();

    const verify = "false";

    const seller_verification_id = uuidv4().toLocaleLowerCase();
    const seller_id = id_seller;
    const token = crypto.randomBytes(64).toString("hex");

    const url = `${process.env.BASE_URL}seller/verify?id=${seller_id}&token=${token}`;

    await sendemailseller(store_seller, email_seller, "Verify Email", url);

    const data = {
      id_seller,
      name_seller,
      store_seller,
      email_seller,
      passwordHash_seller,
      description_seller,
      phone_seller,
      verify,
    };
    insertSeller(data);

    await createSellerVerification(seller_verification_id, seller_id, token);

    commonHelper.response(
      res,
      null,
      201,
      "Sign Up Success, Please check your email for verification"
    );
  },

  VerifyAccount: async (req, res) => {
    try {
      const queryUsersId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryUsersId === "string" && typeof queryToken === "string") {
        const checkUsersVerify = await findId(queryUsersId);

        if (checkUsersVerify.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error users has not found"
          );
        }

        if (checkUsersVerify.rows[0].verify != "false") {
          return commonHelper.response(
            res,
            null,
            403,
            "Users has been verified"
          );
        }

        const result = await checkSellerVerification(queryUsersId, queryToken);

        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryUsersId);
          await deleteSellerVerification(queryUsersId, queryToken);
          commonHelper.response(res, null, 200, "Users verified succesful");
        }
      } else {
        return commonHelper.response(
          res,
          null,
          403,
          "Invalid url verification"
        );
      }
    } catch (error) {
      console.log(error);

      // res.send(createError(404));
    }
  },

  loginSeller: async (req, res) => {
    const { email_seller, password_seller } = req.body;

    const {
      rows: [verify],
    } = await cekSeller(email_seller);
    if (verify.verify === "false") {
      return res.json({
        message: "seller is unverify",
      });
    }

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

  sendEmailSeller: async (req, res, next) => {
    const { email_seller } = req.body;
    await sendemailseller(email_seller, "Verify Email", url);
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

  updateSellerPhoto: async (req, res) => {
    try {
      const id_seller = String(req.params.id);
      let photo_seller = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        photo_seller = result.secure_url;
      }
      const data = {
        id_seller,
        photo_seller,
      };

      updateSellerPhoto(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Users Success")
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
