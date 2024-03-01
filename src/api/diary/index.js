import KoaRouter from "koa-router";
import {
  query,
  insert,
  getUser,
  update_content,
  update_reaction_string,
} from "./ctrl.js";

const router = new KoaRouter();
router.post("/query", query);
router.post("/getUser", getUser);
router.post("/insert", insert);
router.post("/update_content", update_content);
router.post("/update_reaction_string", update_reaction_string);

export default router;
