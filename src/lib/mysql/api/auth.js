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

export const db_getById = (id) => {
  return createPromise(`SELECT * FROM auth WHERE id='${id}'`);
};

export const update_diary_last = ({ id, diary_last }) => {
  return createPromise(
    `UPDATE auth SET diary_last='${diary_last}' WHERE id='${id}'`
  );
};
