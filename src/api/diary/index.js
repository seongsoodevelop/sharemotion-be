import KoaRouter from "koa-router";
import {
  query,
  insert,
  getUser,
  update_content,
  update_love,
  getUserLoved,
} from "./ctrl.js";

const router = new KoaRouter();
router.post("/query", query);
router.post("/getUser", getUser);
router.post("/getUserLoved", getUserLoved);
router.post("/insert", insert);
router.post("/update_content", update_content);
router.post("/update_love", update_love);

export default router;
