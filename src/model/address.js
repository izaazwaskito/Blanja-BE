const Pool = require("../config/db");

const selectAllAddress = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM address ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const selectAddress = (id_user) => {
  return Pool.query(`SELECT * FROM address WHERE id_user = '${id_user}'`);
};

const insertAddress = (data) => {
  const {
    id_address,
    name_address,
    street_address,
    phone_address,
    postal_address,
    city_address,
    place_address,
    id_user,
  } = data;
  return Pool.query(
    `INSERT INTO address(id_address,name_address,street_address,phone_address,postal_address,city_address,place_address,id_user) VALUES(${id_address},'${name_address}', '${street_address}', '${phone_address}', '${postal_address}', '${city_address}', '${place_address}','${id_user}')`
  );
};

const updateAddress = (data) => {
  const {
    id_address,
    name_address,
    street_address,
    phone_address,
    postal_address,
    city_address,
    place_address,
  } = data;
  return Pool.query(
    `UPDATE address SET name_address = '${name_address}', street_address = '${street_address}', phone_address = '${phone_address}', postal_address = '${postal_address}', city_address = '${city_address}', place_address = '${place_address}' WHERE id_address = ${id_address}`
  );
};

const deleteAddress = (id_address) => {
  return Pool.query(`DELETE FROM address WHERE id_address = ${id_address}`);
};

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM address`);
};

const findId = (id_address) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT id_address FROM address WHERE id_address=${id_address}`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

module.exports = {
  selectAllAddress,
  selectAddress,
  insertAddress,
  updateAddress,
  deleteAddress,
  countData,
  findId,
};
