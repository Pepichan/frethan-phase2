import { Router } from "express";

import { listQuotesForRfq, submitQuote } from "../controllers/quoteController";

const router = Router();

router.post("/", submitQuote);
router.get("/rfq/:rfqId", listQuotesForRfq);

export default router;
