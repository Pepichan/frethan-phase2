import type { Request, Response } from "express";

import { prisma } from "../app";

const parseIntId = (value: unknown) => {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

type SubmitQuoteBody = {
  rfqId: number;
  supplierId: number;
  currency?: string;
  validityUntil?: string;
  items: Array<{ rfqItemId: number; unitPrice: string | number }>;
};

export const submitQuote = async (req: Request, res: Response) => {
  const body = req.body as Partial<SubmitQuoteBody>;

  const rfqId = parseIntId(body.rfqId);
  const supplierId = parseIntId(body.supplierId);

  if (!rfqId || !supplierId) {
    res.status(400).json({ status: "error", message: "rfqId and supplierId are required" });
    return;
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    res.status(400).json({ status: "error", message: "items are required" });
    return;
  }

  const validityUntil = body.validityUntil ? new Date(body.validityUntil) : undefined;
  const currency = typeof body.currency === "string" && body.currency.trim() ? body.currency.trim() : "AUD";

  try {
    // Load RFQ items to compute totals against quantities.
    const rfq = await prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: { items: true },
    });

    if (!rfq) {
      res.status(404).json({ status: "error", message: "rfq_not_found" });
      return;
    }

    // Map quantities by rfqItemId
    const qtyByItemId = new Map<number, number>();
    for (const rfqItem of rfq.items) {
      const qty = Number((rfqItem as any).quantity);
      if (Number.isFinite(qty)) {
        qtyByItemId.set(rfqItem.id, qty);
      }
    }

    // Build quote items and compute total = sum(unitPrice * quantity)
    const quoteItems: Array<{ rfqItemId: number; unitPrice: number; quantity: number; subtotal: number }> = [];
    let total = 0;

    for (const it of body.items) {
      const rfqItemId = parseIntId(it?.rfqItemId);
      if (!rfqItemId) {
        res.status(400).json({ status: "error", message: "invalid_rfqItemId" });
        return;
      }

      const unitPriceNum = Number(it.unitPrice);
      if (!Number.isFinite(unitPriceNum)) {
        res.status(400).json({ status: "error", message: "invalid_unitPrice" });
        return;
      }

      const quantity = qtyByItemId.get(rfqItemId);
      if (!quantity) {
        res.status(400).json({ status: "error", message: "rfq_item_not_found" });
        return;
      }

      const subtotal = unitPriceNum * quantity;
      total += subtotal;
      quoteItems.push({ rfqItemId, unitPrice: unitPriceNum, quantity, subtotal });
    }

    const quote = await prisma.quote.create({
      data: {
        rfqId,
        supplierId,
        currency,
        validityUntil,
        totalPrice: total as any,
        status: "PENDING",
        items: {
          create: quoteItems.map((it) => ({
            rfqItemId: it.rfqItemId,
            unitPrice: it.unitPrice as any,
            quantity: it.quantity as any,
            subtotal: it.subtotal as any,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json({ status: "ok", quote });
  } catch (e) {
    console.error("submitQuote error:", e);
    res.status(500).json({ status: "error", message: "failed_to_submit_quote" });
  }
};

export const listQuotesForRfq = async (req: Request, res: Response) => {
  const rfqId = parseIntId(req.params.rfqId);
  if (!rfqId) {
    res.status(400).json({ status: "error", message: "invalid_rfq_id" });
    return;
  }

  try {
    const quotes = await prisma.quote.findMany({
      where: { rfqId },
      orderBy: { createdAt: "desc" },
      include: { items: true, supplier: true },
    });

    res.status(200).json({ status: "ok", quotes });
  } catch (e) {
    console.error("listQuotesForRfq error:", e);
    res.status(500).json({ status: "error", message: "failed_to_list_quotes" });
  }
};
