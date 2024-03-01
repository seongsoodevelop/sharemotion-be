import * as Diary from "#lib/mysql/api/diary.js";
import { TAG_DB } from "#lib/tagList.js";

export const query = async (ctx, next) => {
  try {
    const { diaryTagCategory, page } = ctx.request.body;
    if (diaryTagCategory === "") {
      const res = await Diary.db_getPage(page);
      ctx.body = res;
    } else {
      const res = await Diary.db_getPageCategory(diaryTagCategory, page);
      ctx.body = res;
    }
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

    const tag_category_list = [];
    let tag_list = ctx.request.body.tag_string.trim().split(" ");
    tag_list = tag_list.map((tag) => {
      tag = tag.slice(1, tag.length);
      let res = "default";
      const o = TAG_DB.find((o) => o.list.find((x) => x === tag));
      if (o) res = o.type;
      return res;
    });
    tag_list.forEach((o) => {
      if (tag_category_list.find((x) => x === o)) {
      } else {
        tag_category_list.push(o);
      }
    });

    await tag_category_list.forEach(async (o) => {
      await Diary.db_insert_relation_tag({
        diary_id: res.insertId,
        tag_category: o,
      });
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

export const update_reaction_string = async (ctx, next) => {
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

    await Diary.db_update_reaction_string(ctx.request.body);
    ctx.body = ctx.request.body;
  } catch (e) {
    ctx.throw(400, e.message);
  }
};

const renew_diary_tag_relation = async (ctx, next) => {
  const _res = await Diary.db_get();
  await _res.forEach(async (res) => {
    const tag_category_list = [];
    let tag_list = res.tag_string.trim().split(" ");
    tag_list = tag_list.map((tag) => {
      tag = tag.slice(1, tag.length);
      let res = "default";
      const o = TAG_DB.find((e) => {
        return e.list.findIndex((x) => x === tag) !== -1;
      });
      if (o) res = o.type;
      return res;
    });

    tag_list.forEach((o) => {
      if (tag_category_list.findIndex((x) => x === o) !== -1) {
      } else {
        tag_category_list.push(o);
      }
    });

    await tag_category_list.forEach(async (o) => {
      if (o === "default") return;
      await Diary.db_insert_relation_tag({
        diary_id: res.id,
        tag_category: o,
      });
    });
  });
};
