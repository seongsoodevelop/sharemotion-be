import KoaRouter from "koa-router";
import { query, insert } from "./ctrl.js";

const router = new KoaRouter();
router.post("/query", query);
router.post("/insert", insert);

export default router;
