import * as Diary from "#lib/mysql/api/diary.js";

export const query = async (ctx, next) => {
  try {
    const { page } = ctx.request.body;
    const res = await Diary.db_getPage(page);
    ctx.body = res;
  } catch (e) {
    ctx.throw(400, e.message);
  }
};

export const insert = async (ctx, next) => {
  try {
    const auth = ctx.request.auth;
    if (!auth) {
      ctx.throw(400, "you must sign in first");
    }

    const res = await Diary.db_insert({
      ...ctx.request.body,
      auth_id: auth.id,
    });
    ctx.body = { ...ctx.request.body, auth_id: auth.id, id: res.insertId };
  } catch (e) {
    console.log(e);
    ctx.throw(400, e.message);
  }
};
