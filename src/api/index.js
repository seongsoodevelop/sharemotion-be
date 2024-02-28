import KoaRouter from "koa-router";
import Debug from "./debug/index.js";
import Auth from "./auth/index.js";
import Diary from "./diary/index.js";

const router = new KoaRouter();
router.use("/debug", Debug.routes());
router.use("/auth", Auth.routes());
router.use("/diary", Diary.routes());

export default router;
