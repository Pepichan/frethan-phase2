import { Router } from "express";
import {
  addRfqItem,
  createRfq,
  getRfq,
  listRfqs,
  listRfqQuotes,
  submitQuote,
  updateRfq,
} from "../controllers/rfqController";

const router = Router();

router.get("/", listRfqs);
router.get("/:id", getRfq);
router.post("/", createRfq);
router.patch("/:id", updateRfq);
router.post("/:id/items", addRfqItem);
router.get("/:id/quotes", listRfqQuotes);
router.post("/:id/quotes", submitQuote);

export default router;
