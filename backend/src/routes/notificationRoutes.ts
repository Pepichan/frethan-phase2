import { Router } from "express";

import { authRequired } from "../middleware/authRequired";
import { listNotifications, markNotificationRead } from "../controllers/notificationController";

const router = Router();

router.get("/", authRequired, listNotifications);
router.patch("/:id/read", authRequired, markNotificationRead);

export default router;
