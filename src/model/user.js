const Pool = require("../config/db");

const insertUser = (data) => {
  const {
    id_user,
    email_user,
    passwordHash_user,
    fullname_user,
    role_user,
    verify,
  } = data;
  return Pool.query(`INSERT INTO users(id_user, email_user, password_user, fullname_user, role_user,verify) 
    VALUES ('${id_user}','${email_user}','${passwordHash_user}','${fullname_user}','${role_user}','${verify}')`);
};

const createUsersVerification = (users_verification_id, users_id, token) => {
  return Pool.query(
    `insert into users_verification ( id , users_id , token ) values ( '${users_verification_id}' , '${users_id}' , '${token}' )`
  );
};

const checkUsersVerification = (queryUsersId, queryToken) => {
  return Pool.query(
    `select * from users_verification where users_id='${queryUsersId}' and token = '${queryToken}' `
  );
};

const cekUser = (email_user) => {
  return Pool.query(
    `select verify from users where email_user = '${email_user}' `
  );
};

const deleteUsersVerification = (queryUsersId, queryToken) => {
  return Pool.query(
    `delete from users_verification  where users_id='${queryUsersId}' and token = '${queryToken}' `
  );
};

const updateAccountVerification = (queryUsersId) => {
  return Pool.query(
    `update users set verify='true' where id_user='${queryUsersId}' `
  );
};

const selectAllUser = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM users ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const selectUser = (id_user) => {
  return Pool.query(`SELECT * FROM users WHERE id_user = '${id_user}'`);
};

const updateUser = (data) => {
  const { id_user, email_user, role_user, fullname_user } = data;
  return Pool.query(
    `UPDATE users SET email_user = '${email_user}', role_user = '${role_user}', fullname_user = '${fullname_user}' WHERE id_user = '${id_user}'`
  );
};

const findId = (id_user) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM users WHERE id_user='${id_user}'`,
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

const findEmail = (email_user) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM users WHERE email_user= '${email_user}' `,
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
  return Pool.query(`SELECT COUNT(*) FROM users`);
};

module.exports = {
  insertUser,
  findEmail,
  selectAllUser,
  countData,
  findId,
  selectUser,
  updateUser,
  createUsersVerification,
  checkUsersVerification,
  cekUser,
  updateAccountVerification,
  deleteUsersVerification,
};
