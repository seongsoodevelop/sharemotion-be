import createPromise from "../query.js";

export const db_getPage = (page) => {
  return createPromise(
    `SELECT * FROM diary ORDER BY id DESC LIMIT 10 OFFSET ${(page - 1) * 10}`
  );
};
