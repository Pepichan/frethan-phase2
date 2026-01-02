import { Router } from "express";

import { authRequired } from "../middleware/authRequired";
import { createOrder, deleteOrder, getOrderById, listOrders, updateOrder } from "../controllers/orderController";

const router = Router();

router.post("/", authRequired, createOrder);
router.get("/", authRequired, listOrders);
router.get("/:id", authRequired, getOrderById);
router.put("/:id", authRequired, updateOrder);
router.patch("/:id", authRequired, updateOrder);
router.delete("/:id", authRequired, deleteOrder);

export default router;
