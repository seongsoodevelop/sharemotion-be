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

export const getUser = async (ctx, next) => {
  try {
    const auth = ctx.request.auth;
    if (!auth) {
      ctx.throw(400, "you must sign in first");
    }

    const res = await Diary.db_getUser(auth.id);
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
    ctx.throw(400, e.message);
  }
};

export const update_content = async (ctx, next) => {
  try {
    const auth = ctx.request.auth;
    if (!auth) {
      ctx.throw(400, "you must sign in first");
    }

    const { id } = ctx.request.body;

    let diary = null;
    await Diary.db_find(id).then((res) => {
      if (res.length === 1) {
        diary = res[0];
      }
    });

    if (!diary) {
      ctx.throw(400, "diary does not exists.");
    }

    if (diary.auth_id !== auth.id) {
      ctx.throw(401);
    }

    await Diary.db_update_content(ctx.request.body);
    ctx.body = ctx.request.body;
  } catch (e) {
    ctx.throw(400, e.message);
  }
};
