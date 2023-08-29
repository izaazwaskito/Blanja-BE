let {
  selectAllAddress,
  selectAddress,
  insertAddress,
  updateAddress,
  deleteAddress,
  countData,
  findId,
} = require("../model/address");
const commonHelper = require("../helper/common");

let addressController = {
  getAllAddress: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id_address";
      const sort = req.query.sort || "ASC";
      let result = await selectAllAddress({ limit, offset, sort, sortby });
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
        "Get Address Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },
  getDetailAddress: async (req, res) => {
    const id_user = String(req.params.id);
    selectAddress(id_user)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get Address Detail Success"
        );
      })
      .catch((err) => res.send(err));
  },
  createAddress: async (req, res) => {
    const {
      name_address,
      street_address,
      phone_address,
      postal_address,
      city_address,
      place_address,
      id_user,
    } = req.body;
    const {
      rows: [count],
    } = await countData();
    const id_address = Number(count.count) + 1;
    const data = {
      id_address,
      name_address,
      street_address,
      phone_address,
      postal_address,
      city_address,
      place_address,
      id_user,
    };
    insertAddress(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create Order Success")
      )
      .catch((err) => res.send(err));
  },
  updateAddress: async (req, res) => {
    try {
      const id_address = Number(req.params.id);
      const {
        name_address,
        street_address,
        phone_address,
        postal_address,
        city_address,
        place_address,
      } = req.body;
      const { rowCount } = await findId(id_address);
      //   const role_user = req.payload.role_user;
      //   try {
      //     if (role_user != "seller") throw "You're Cannot Access this feature";
      //   } catch (error) {
      //     return commonHelper.response(res, null, 404, error);
      //   }
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        id_address,
        name_address,
        street_address,
        phone_address,
        postal_address,
        city_address,
        place_address,
      };
      updateAddress(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Address Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  deleteAddress: async (req, res) => {
    try {
      const id_address = Number(req.params.id);
      const { rowCount } = await findId(id_address);
      //   const role_user = req.payload.role_user;
      //   try {
      //     if (role_user != "seller") throw "You're Cannot Access this feature";
      //   } catch (error) {
      //     return commonHelper.response(res, null, 404, error);
      //   }
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteAddress(id_address)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Address Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = addressController;
