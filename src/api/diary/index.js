import KoaRouter from "koa-router";
import { query, insert, getUser } from "./ctrl.js";

const router = new KoaRouter();
router.post("/query", query);
router.post("/getUser", getUser);
router.post("/insert", insert);

export default router;
