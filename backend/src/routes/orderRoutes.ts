import { Router } from "express";

import { authRequired } from "../middleware/authRequired";
import { createOrder, deleteOrder, getOrderById, updateOrder } from "../controllers/orderController";

const router = Router();

router.post("/", authRequired, createOrder);
router.get("/:id", authRequired, getOrderById);
router.put("/:id", authRequired, updateOrder);
router.delete("/:id", authRequired, deleteOrder);

export default router;
