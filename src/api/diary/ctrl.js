import * as Diary from "#lib/mysql/api/diary.js";

export const query = async (ctx, next) => {
  try {
    const { page } = ctx.request.body;
    const res = await Diary.db_getPage(page);
    ctx.body = res;
  } catch (e) {
    ctx.throw(400, e);
  }
};
