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
    verify,
  } = data;
  return Pool.query(`INSERT INTO seller(id_seller, email_seller, password_seller, name_seller, description_seller, store_seller,phone_seller,verify) 
    VALUES ('${id_seller}','${email_seller}','${passwordHash_seller}','${name_seller}','${description_seller}','${store_seller}','${phone_seller}','${verify}')`);
};

const createSellerVerification = (seller_verification_id, seller_id, token) => {
  return Pool.query(
    `insert into seller_verification ( id , seller_id , token ) values ( '${seller_verification_id}' , '${seller_id}' , '${token}' )`
  );
};

const checkSellerVerification = (queryUsersId, queryToken) => {
  return Pool.query(
    `select * from seller_verification where seller_id='${queryUsersId}' and token = '${queryToken}' `
  );
};

const cekSeller = (email_seller) => {
  return Pool.query(
    `select verify from seller where email_seller = '${email_seller}'`
  );
};

const deleteSellerVerification = (queryUsersId, queryToken) => {
  return Pool.query(
    `delete from seller_verification  where seller_id='${queryUsersId}' and token = '${queryToken}' `
  );
};

const updateAccountVerification = (queryUsersId) => {
  return Pool.query(
    `update seller set verify='true' where id_seller='${queryUsersId}' `
  );
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
      `SELECT * FROM seller WHERE id_seller='${id_seller}'`,
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
  createSellerVerification,
  checkSellerVerification,
  cekSeller,
  deleteSellerVerification,
  updateAccountVerification,
};
