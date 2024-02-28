import KoaRouter from "koa-router";
import { query } from "./ctrl.js";

const router = new KoaRouter();
router.post("/query", query);

export default router;
