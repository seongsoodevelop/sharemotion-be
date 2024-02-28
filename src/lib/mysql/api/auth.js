import createPromise from "../query.js";

export const db_register = ({ email, token }) => {
  return createPromise(
    `INSERT INTO auth (email, token, create_at) VALUE ('${email}', '${token}', CURRENT_TIMESTAMP())`
  );
};

export const db_getByUsername = (username) => {
  return createPromise(`SELECT * FROM auth WHERE username='${username}'`);
};

export const db_getByEmail = (email) => {
  return createPromise(`SELECT * FROM auth WHERE email='${email}'`);
};
