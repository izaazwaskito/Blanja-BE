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
} = require("../model/user");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");

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

  registerUser: async (req, res) => {
    let { fullname_user, email_user, password_user, role_user } = req.body;
    const { rowCount } = await findEmail(email_user);
    if (rowCount) {
      return res.json({ message: "Email Already Taken" });
    }
    const passwordHash_user = bcrypt.hashSync(password_user);
    const id_user = uuidv4();

    const data = {
      id_user,
      email_user,
      passwordHash_user,
      fullname_user,
      role_user,
    };
    insertUser(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create User Success")
      )
      .catch((err) => res.send(err));
  },
  loginUser: async (req, res) => {
    const { email_user, password_user } = req.body;
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
