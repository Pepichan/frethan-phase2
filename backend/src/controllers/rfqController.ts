import type { Request, Response } from "express";

import { prisma } from "../app";

const parseIntId = (value: unknown) => {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

type CreateRfqBody = {
  buyerId: number;
  requiredBy?: string;
  notes?: string;
  currency?: string;
  items?: Array<{ description: string; quantity: string | number; unit: string; productId?: number | null }>;
};

export const createRfq = async (req: Request, res: Response) => {
  const body = req.body as Partial<CreateRfqBody>;

  const buyerId = parseIntId(body.buyerId);
  if (!buyerId) {
    res.status(400).json({ status: "error", message: "buyerId is required" });
    return;
  }

  const requiredBy = body.requiredBy ? new Date(body.requiredBy) : undefined;
  const currency = typeof body.currency === "string" && body.currency.trim() ? body.currency.trim() : undefined;
  const notes = typeof body.notes === "string" ? body.notes : undefined;

  const items = Array.isArray(body.items) ? body.items : [];

  try {
    const rfq = await prisma.rFQ.create({
      data: {
        buyerId,
        requiredBy,
        notes,
        currency: currency ?? "AUD",
        status: "DRAFT",
        items: {
          create: items.map((it) => ({
            description: String(it.description ?? "").trim(),
            quantity: it.quantity as any,
            unit: String(it.unit ?? "").trim(),
            productId: it.productId ?? null,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json({ status: "ok", rfq });
  } catch (e) {
    console.error("createRfq error:", e);
    res.status(500).json({ status: "error", message: "failed_to_create_rfq" });
  }
};

export const listRfqs = async (_req: Request, res: Response) => {
  try {
    const rfqs = await prisma.rFQ.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
      take: 50,
    });
    res.status(200).json({ status: "ok", rfqs });
  } catch (e) {
    console.error("listRfqs error:", e);
    res.status(500).json({ status: "error", message: "failed_to_list_rfqs" });
  }
};

export const getRfqById = async (req: Request, res: Response) => {
  const id = parseIntId(req.params.id);
  if (!id) {
    res.status(400).json({ status: "error", message: "invalid_id" });
    return;
  }

  try {
    const rfq = await prisma.rFQ.findUnique({
      where: { id },
      include: {
        items: true,
        quotes: { include: { items: true, supplier: true } },
      },
    });

    if (!rfq) {
      res.status(404).json({ status: "error", message: "rfq_not_found" });
      return;
    }

    res.status(200).json({ status: "ok", rfq });
  } catch (e) {
    console.error("getRfqById error:", e);
    res.status(500).json({ status: "error", message: "failed_to_get_rfq" });
  }
};

type AddItemBody = { description: string; quantity: string | number; unit: string; productId?: number | null };

export const addRfqItem = async (req: Request, res: Response) => {
  const rfqId = parseIntId(req.params.id);
  if (!rfqId) {
    res.status(400).json({ status: "error", message: "invalid_rfq_id" });
    return;
  }

  const body = req.body as Partial<AddItemBody>;
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const unit = typeof body.unit === "string" ? body.unit.trim() : "";

  if (!description || !unit || body.quantity === undefined || body.quantity === null) {
    res.status(400).json({ status: "error", message: "description, quantity, unit are required" });
    return;
  }

  try {
    const item = await prisma.rFQItem.create({
      data: {
        rfqId,
        description,
        unit,
        quantity: body.quantity as any,
        productId: body.productId ?? null,
      },
    });

    res.status(201).json({ status: "ok", item });
  } catch (e) {
    console.error("addRfqItem error:", e);
    res.status(500).json({ status: "error", message: "failed_to_add_item" });
  }
};

export const submitRfq = async (req: Request, res: Response) => {
  const id = parseIntId(req.params.id);
  if (!id) {
    res.status(400).json({ status: "error", message: "invalid_id" });
    return;
  }

  try {
    const rfq = await prisma.rFQ.update({
      where: { id },
      data: { status: "OPEN" },
    });

    res.status(200).json({ status: "ok", rfq });
  } catch (e) {
    console.error("submitRfq error:", e);
    res.status(500).json({ status: "error", message: "failed_to_submit_rfq" });
  }
};
