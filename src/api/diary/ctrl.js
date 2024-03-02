import * as Diary from "#lib/mysql/api/diary.js";
import { TAG_DB } from "#lib/tagList.js";
import * as Auth from "#lib/mysql/api/auth.js";
import moment from "moment";

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

export const getUserLikedDiary = async (ctx, next) => {
  try {
    const auth = ctx.request.auth;
    if (!auth) {
      ctx.throw(400, "you must sign in first");
    }

    if (ctx.request.body.isDiaryDataNeeded) {
      const res = await Diary.db_getLikedDiaryJoin(auth.id);
      ctx.body = res;
    } else {
      const res = await Diary.db_getLikedDiary(auth.id);
      ctx.body = res;
    }
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

    let auth_db = null;
    await Auth.db_getById(auth.id).then((res) => {
      if (res.length === 1) {
        auth_db = res[0];
      }
    });
    if (!auth_db) {
      ctx.throw(400);
    }

    let lastDate = null;
    let count = 0;
    if (auth_db.diary_last) {
      lastDate = auth_db.diary_last.split(" ")[0];
      count = Number(auth_db.diary_last.split(" ")[1]);
    }

    if (lastDate !== null && lastDate === moment().format("YYYY-MM-DD")) {
      if (count >= 5) {
        ctx.throw(400, "max diary count per day exceeded.");
      }
    }

    await Auth.update_diary_last({
      id: auth.id,
      diary_last: `${moment().format("YYYY-MM-DD")} ${count + 1}`,
    });

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

    ctx.body = {
      ...ctx.request.body,
      auth_id: auth.id,
      id: res.insertId,
      reaction_string: "0 0 0 0 0",
    };
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

export const update_love = async (ctx, next) => {
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

    await Diary.db_update_love({
      id: diary.id,
      love: diary.love + 1,
    });
    ctx.body = ctx.request.body;
  } catch (e) {
    console.log(e);
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
