import KoaRouter from "koa-router";
import { login } from "./ctrl.js";

const router = new KoaRouter();
router.post("/login", login);

export default router;
