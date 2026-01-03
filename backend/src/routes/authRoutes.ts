import { Router } from "express";
import {
	login,
	logout,
	me,
	oauthCallback,
	oauthStart,
	wechatDemoCallback,
	wechatDemoLogin,
	register,
} from "../controllers/authController";
import { authRequired } from "../middleware/authRequired";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authRequired, me);

// OAuth providers
router.get("/google", oauthStart("google"));
router.get("/google/callback", oauthCallback("google"));
router.get("/facebook", oauthStart("facebook"));
router.get("/facebook/callback", oauthCallback("facebook"));

// WeChat demo (Free Scope)
router.get("/wechat/demo/login", wechatDemoLogin);
router.get("/wechat/demo/callback", wechatDemoCallback);

router.get("/wechat", oauthStart("wechat"));
router.get("/wechat/callback", oauthCallback("wechat"));

export default router;
