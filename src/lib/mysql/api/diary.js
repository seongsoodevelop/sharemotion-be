import createPromise from "../query.js";

export const db_get = () => {
  return createPromise(`SELECT * FROM diary`);
};

export const db_getPage = (page) => {
  return createPromise(
    `SELECT * FROM diary ORDER BY id DESC LIMIT 10 OFFSET ${(page - 1) * 10}`
  );
};

export const db_getPageCategory = (diaryTagCategory, page) => {
  return createPromise(
    `SELECT * FROM diary_relation_tag L LEFT JOIN diary R ON(L.diary_id = R.id) WHERE L.tag_category = '${diaryTagCategory}' ORDER BY id DESC LIMIT 10 OFFSET ${
      (page - 1) * 10
    }`
  );
};

export const db_getLoved = (auth_id, page) => {
  return createPromise(
    `SELECT * FROM diary_relation_user L LEFT JOIN diary R ON(L.diary_id = R.id) WHERE L.auth_id = '${auth_id}' ORDER BY id DESC LIMIT 10 OFFSET ${
      (page - 1) * 10
    }`
  );
};

export const db_getLovedDiaryWithId = (auth_id, diary_id) => {
  return createPromise(
    `SELECT * FROM diary_relation_user WHERE auth_id = '${auth_id}' AND diary_id = '${diary_id}'`
  );
};

export const db_delLikedDiaryWithId = (auth_id, diary_id) => {
  return createPromise(
    `DELETE FROM diary_relation_user WHERE auth_id = '${auth_id}' AND diary_id = '${diary_id}'`
  );
};

export const db_insLikedDiaryWithId = (auth_id, diary_id) => {
  return createPromise(
    `INSERT INTO diary_relation_user (auth_id, diary_id) VALUE ('${auth_id}', '${diary_id}')`
  );
};

export const db_getLovedDiary = (auth_id) => {
  return createPromise(
    `SELECT * FROM diary_relation_user WHERE auth_id = '${auth_id}'`
  );
};

export const db_getLovedDiaryJoin = (auth_id) => {
  return createPromise(
    `SELECT * FROM diary_relation_user L LEFT JOIN diary R ON(L.diary_id = R.id) WHERE L.auth_id = '${auth_id}'`
  );
};

export const db_find = (id) => {
  return createPromise(`SELECT * FROM diary WHERE id = '${id}'`);
};

export const db_getUser = (auth_id) => {
  return createPromise(`SELECT * FROM diary WHERE auth_id = '${auth_id}'`);
};

export const db_insert = ({ auth_id, tag_string, content }) => {
  return createPromise(
    `INSERT INTO diary (auth_id, tag_string, content, create_at) VALUE ('${auth_id}', '${tag_string}', '${content}', CURRENT_TIMESTAMP())`
  );
};

export const db_insert_relation_tag = ({ diary_id, tag_category }) => {
  return createPromise(
    `INSERT INTO diary_relation_tag (diary_id, tag_category) VALUE ('${diary_id}', '${tag_category}')`
  );
};

export const db_update_content = ({ id, content }) => {
  return createPromise(
    `UPDATE diary SET content='${content}' WHERE id='${id}'`
  );
};

export const db_update_love = ({ id, love }) => {
  return createPromise(`UPDATE diary SET love='${love}' WHERE id='${id}'`);
};
