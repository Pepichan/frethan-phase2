import { Router } from "express";
import {
	login,
	logout,
	me,
	linkedAccounts,
	oauthCallback,
	oauthLinkStart,
	oauthStart,
	unlinkProvider,
	wechatDemoLink,
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

// Linked accounts (Settings)
router.get("/linked-accounts", authRequired, linkedAccounts);

// OAuth providers
router.get("/google", oauthStart("google"));
router.get("/google/link", authRequired, oauthLinkStart("google"));
router.get("/google/callback", oauthCallback("google"));
router.get("/facebook", oauthStart("facebook"));
router.get("/facebook/link", authRequired, oauthLinkStart("facebook"));
router.get("/facebook/callback", oauthCallback("facebook"));

router.post("/google/unlink", authRequired, unlinkProvider("google"));
router.post("/facebook/unlink", authRequired, unlinkProvider("facebook"));

// WeChat demo (Free Scope)
router.get("/wechat/demo/login", wechatDemoLogin);
router.get("/wechat/demo/callback", wechatDemoCallback);

router.post("/wechat/link", authRequired, wechatDemoLink);
router.post("/wechat/unlink", authRequired, unlinkProvider("wechat"));

router.get("/wechat", oauthStart("wechat"));
router.get("/wechat/callback", oauthCallback("wechat"));

export default router;
