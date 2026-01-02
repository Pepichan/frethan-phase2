import { Router } from "express";

import { addRfqItem, createRfq, getRfqById, listRfqs, submitRfq } from "../controllers/rfqController";

const router = Router();

router.get("/", listRfqs);
router.post("/", createRfq);
router.get("/:id", getRfqById);
router.post("/:id/items", addRfqItem);
router.post("/:id/submit", submitRfq);

export default router;
