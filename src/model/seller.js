const Pool = require("../config/db");

const insertSeller = (data) => {
  const {
    id_seller,
    store_seller,
    email_seller,
    phone_seller,
    passwordHash_seller,
    name_seller,
    description_seller,
  } = data;
  return Pool.query(`INSERT INTO seller(id_seller, email_seller, password_seller, name_seller, description_seller, store_seller,phone_seller) 
    VALUES ('${id_seller}','${email_seller}','${passwordHash_seller}','${name_seller}','${description_seller}','${store_seller}','${phone_seller}')`);
};

const updateSeller = (data) => {
  const {
    id_seller,
    store_seller,
    email_seller,
    phone_seller,
    description_seller,
  } = data;
  return Pool.query(
    `UPDATE seller SET store_seller = '${store_seller}', email_seller = '${email_seller}', phone_seller = '${phone_seller}', description_seller = '${description_seller}'WHERE id_seller = '${id_seller}'`
  );
};

const selectAllSeller = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM seller ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};
const selectSeller = (id_seller) => {
  return Pool.query(`SELECT * FROM seller WHERE id_seller = '${id_seller}'`);
};

const findEmail = (email_seller) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM seller WHERE email_seller= '${email_seller}' `,
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

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM seller`);
};

const findId = (id_seller) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT id_seller FROM seller WHERE id_seller='${id_seller}'`,
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
  insertSeller,
  findEmail,
  updateSeller,
  selectAllSeller,
  selectSeller,
  countData,
  findId,
};
