const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let {
  insertUser,
  findEmail,
  selectAllUser,
  countData,
  findId,
  selectUser,
  updateUser,
  createUsersVerification,
  checkUsersVerification,
  updateAccountVerification,
  deleteUsersVerification,
  cekUser,
  updateUserPhoto,
} = require("../model/user");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const sendemail = require("../middlewares/sendemail");
const cloudinary = require("../middlewares/cloudinary");
const crypto = require("crypto");

let userController = {
  getAllUser: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id_user";
      const sort = req.query.sort || "ASC";
      let result = await selectAllUser({ limit, offset, sort, sortby });
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
        "Get User Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getDetailUser: async (req, res) => {
    const id_user = String(req.params.id);
    const { rowCount } = await findId(id_user);
    if (!rowCount) {
      return res.json({ message: "ID Not Found" });
    }
    selectUser(id_user)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Get User Detail Success");
      })
      .catch((err) => res.send(err));
  },

  updateUser: async (req, res) => {
    try {
      const id_user = String(req.params.id);
      const { fullname_user, email_user, role_user } = req.body;
      const data = {
        id_user,
        fullname_user,
        email_user,
        role_user,
      };
      updateUser(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Product Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  updateUserPhoto: async (req, res) => {
    try {
      const id_user = String(req.params.id);
      let photo_user = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        photo_user = result.secure_url;
      }
      const data = {
        id_user,
        photo_user,
      };

      updateUserPhoto(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  registerUser: async (req, res) => {
    let { fullname_user, email_user, password_user, role_user } = req.body;
    const checkEmail = await findEmail(email_user);
    try {
      if (checkEmail.rowCount == 1) throw "Email already used";
      // delete checkEmail.rows[0].password;
    } catch (error) {
      delete checkEmail.rows[0].password;
      return commonHelper.response(res, null, 403, error);
    }

    //users
    const passwordHash_user = bcrypt.hashSync(password_user);
    const id_user = uuidv4();

    // verification
    const verify = "false";

    const users_verification_id = uuidv4().toLocaleLowerCase();
    const users_id = id_user;
    const token = crypto.randomBytes(64).toString("hex");

    // url localhost
    const url = `${process.env.BASE_URL}user/verify?id=${users_id}&token=${token}`;

    await sendemail(fullname_user, email_user, "Verify Email", url);

    const data = {
      id_user,
      email_user,
      passwordHash_user,
      fullname_user,
      role_user,
      verify,
    };

    await insertUser(data);

    await createUsersVerification(users_verification_id, users_id, token);

    commonHelper.response(
      res,
      null,
      201,
      "Sign Up Success, Please check your email for verification"
    );

    // insertUser(data)
    //   .then((result) =>
    //     commonHelper.response(res, result.rows, 201, "Create User Success")
    //   )
    //   .catch((err) => res.send(err));
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

        const result = await checkUsersVerification(queryUsersId, queryToken);

        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryUsersId);
          await deleteUsersVerification(queryUsersId, queryToken);
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

  loginUser: async (req, res) => {
    const { email_user, password_user } = req.body;
    const {
      rows: [verify],
    } = await cekUser(email_user);
    if (verify.verify === "false") {
      return res.json({
        message: "user is unverify",
      });
    }
    const {
      rows: [user],
    } = await findEmail(email_user);
    if (!user) {
      return res.json({ message: "Email Wrong" });
    }
    const isValidPassword = bcrypt.compareSync(
      password_user,
      user.password_user
    );
    if (!isValidPassword) {
      return res.json({ message: "Password Wrong" });
    }
    delete user.password_user;
    const payload = {
      email_user: user.email_user,
      role_user: user.role_user,
    };
    user.token_user = authHelper.generateToken(payload);
    user.refreshToken = authHelper.generateRefreshToken(payload);
    commonHelper.response(res, user, 201, "Login Successfuly");
  },

  sendEmail: async (req, res, next) => {
    const { email_user } = req.body;
    await sendemail(email_user, "Verify Email", url);
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
      email_user: decoded.email_user,
      role_user: decoded.role_user,
    };
    const result = {
      token_user: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200);
  },
};

module.exports = userController;
