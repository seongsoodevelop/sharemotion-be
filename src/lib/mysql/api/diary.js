import createPromise from "../query.js";

export const db_getPage = (page) => {
  return createPromise(
    `SELECT * FROM diary ORDER BY id DESC LIMIT 10 OFFSET ${(page - 1) * 10}`
  );
};

export const db_getUser = (auth_id) => {
  return createPromise(`SELECT * FROM diary WHERE auth_id = '${auth_id}'`);
};

export const db_insert = ({ auth_id, tag_string, content }) => {
  return createPromise(
    `INSERT INTO diary (auth_id, tag_string, content, create_at) VALUE ('${auth_id}', '${tag_string}', '${content}', CURRENT_TIMESTAMP())`
  );
};
