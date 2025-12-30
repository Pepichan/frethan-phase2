import type { Request, Response } from "express";

import { prisma } from "../app";

const parseId = (value: unknown): number | null => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
};

type CreateRfqItemInput = {
  productId?: number;
  description: string;
  quantity: string | number;
  unit: string;
};

export const listRfqs = async (req: Request, res: Response) => {
  try {
    const buyerId = req.query.buyerId ? parseId(req.query.buyerId) : null;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;

    const rfqs = await prisma.rFQ.findMany({
      where: {
        ...(buyerId ? { buyerId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    res.status(200).json(rfqs);
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to list RFQs" });
  }
};

export const getRfq = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ status: "error", message: "Invalid RFQ id" });
      return;
    }

    const rfq = await prisma.rFQ.findUnique({
      where: { id },
      include: {
        items: true,
        quotes: {
          include: { items: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!rfq) {
      res.status(404).json({ status: "error", message: "RFQ not found" });
      return;
    }

    res.status(200).json(rfq);
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to get RFQ" });
  }
};

export const createRfq = async (req: Request, res: Response) => {
  try {
    const buyerId = parseId(req.body?.buyerId);
    if (!buyerId) {
      res.status(400).json({ status: "error", message: "buyerId is required" });
      return;
    }

    const requiredByRaw = req.body?.requiredBy;
    const requiredBy =
      typeof requiredByRaw === "string" && requiredByRaw.trim() !== ""
        ? new Date(requiredByRaw)
        : undefined;
    if (requiredBy && Number.isNaN(requiredBy.getTime())) {
      res.status(400).json({ status: "error", message: "requiredBy is invalid" });
      return;
    }

    const notes = typeof req.body?.notes === "string" ? req.body.notes : undefined;
    const currency = typeof req.body?.currency === "string" ? req.body.currency : undefined;
    const status = typeof req.body?.status === "string" ? req.body.status : undefined;

    const itemsRaw = req.body?.items;
    const items: CreateRfqItemInput[] = Array.isArray(itemsRaw) ? itemsRaw : [];

    const createItems = items
      .map((item) => {
        const description = typeof item?.description === "string" ? item.description.trim() : "";
        const unit = typeof item?.unit === "string" ? item.unit.trim() : "";
        const quantityNumber = toNumber(item?.quantity);
        const productId = item?.productId ? parseId(item.productId) : null;

        if (!description || !unit || quantityNumber === null || quantityNumber <= 0) {
          return null;
        }

        return {
          description,
          unit,
          quantity: String(quantityNumber),
          ...(productId ? { productId } : {}),
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));

    const created = await prisma.rFQ.create({
      data: {
        buyerId,
        ...(requiredBy ? { requiredBy } : {}),
        ...(notes ? { notes } : {}),
        ...(currency ? { currency } : {}),
        ...(status ? { status: status as any } : {}),
        ...(createItems.length
          ? {
              items: {
                create: createItems,
              },
            }
          : {}),
      },
      include: { items: true },
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to create RFQ" });
  }
};

export const updateRfq = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ status: "error", message: "Invalid RFQ id" });
      return;
    }

    const data: Record<string, unknown> = {};
    if (typeof req.body?.notes === "string") data.notes = req.body.notes;
    if (typeof req.body?.currency === "string") data.currency = req.body.currency;
    if (typeof req.body?.status === "string") data.status = req.body.status;
    if (typeof req.body?.requiredBy === "string" && req.body.requiredBy.trim() !== "") {
      const d = new Date(req.body.requiredBy);
      if (Number.isNaN(d.getTime())) {
        res.status(400).json({ status: "error", message: "requiredBy is invalid" });
        return;
      }
      data.requiredBy = d;
    }

    const updated = await prisma.rFQ.update({
      where: { id },
      data: data as any,
      include: { items: true },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to update RFQ" });
  }
};

export const addRfqItem = async (req: Request, res: Response) => {
  try {
    const rfqId = parseId(req.params.id);
    if (!rfqId) {
      res.status(400).json({ status: "error", message: "Invalid RFQ id" });
      return;
    }

    const description =
      typeof req.body?.description === "string" ? req.body.description.trim() : "";
    const unit = typeof req.body?.unit === "string" ? req.body.unit.trim() : "";
    const quantityNumber = toNumber(req.body?.quantity);
    const productId = req.body?.productId ? parseId(req.body.productId) : null;

    if (!description || !unit || quantityNumber === null || quantityNumber <= 0) {
      res.status(400).json({
        status: "error",
        message: "description, unit, quantity are required",
      });
      return;
    }

    const item = await prisma.rFQItem.create({
      data: {
        rfqId,
        description,
        unit,
        quantity: String(quantityNumber),
        ...(productId ? { productId } : {}),
      },
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to add RFQ item" });
  }
};

export const listRfqQuotes = async (req: Request, res: Response) => {
  try {
    const rfqId = parseId(req.params.id);
    if (!rfqId) {
      res.status(400).json({ status: "error", message: "Invalid RFQ id" });
      return;
    }

    const quotes = await prisma.quote.findMany({
      where: { rfqId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to list quotes" });
  }
};

export const submitQuote = async (req: Request, res: Response) => {
  try {
    const rfqId = parseId(req.params.id);
    if (!rfqId) {
      res.status(400).json({ status: "error", message: "Invalid RFQ id" });
      return;
    }

    const supplierId = parseId(req.body?.supplierId);
    if (!supplierId) {
      res.status(400).json({ status: "error", message: "supplierId is required" });
      return;
    }

    const itemsRaw = req.body?.items;
    if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
      res.status(400).json({ status: "error", message: "items is required" });
      return;
    }

    const rfq = await prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: { items: true },
    });
    if (!rfq) {
      res.status(404).json({ status: "error", message: "RFQ not found" });
      return;
    }

    const rfqItemIds = new Set(rfq.items.map((i) => i.id));

    const quoteItems = itemsRaw
      .map((it: any) => {
        const rfqItemId = parseId(it?.rfqItemId);
        const unitPrice = toNumber(it?.unitPrice);
        const quantity = toNumber(it?.quantity);

        if (!rfqItemId || !rfqItemIds.has(rfqItemId)) return null;
        if (unitPrice === null || unitPrice < 0) return null;
        if (quantity === null || quantity <= 0) return null;

        const subtotalCalc = unitPrice * quantity;
        const subtotal = toNumber(it?.subtotal) ?? subtotalCalc;

        return {
          rfqItemId,
          unitPrice: String(unitPrice),
          quantity: String(quantity),
          subtotal: String(subtotal),
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));

    if (quoteItems.length === 0) {
      res.status(400).json({
        status: "error",
        message: "No valid items. Ensure rfqItemId belongs to this RFQ.",
      });
      return;
    }

    const totalFromItems = quoteItems.reduce((sum, it) => sum + (toNumber(it.subtotal) ?? 0), 0);
    const totalPrice = toNumber(req.body?.totalPrice) ?? totalFromItems;
    const currency = typeof req.body?.currency === "string" ? req.body.currency : rfq.currency;

    const validityUntilRaw = req.body?.validityUntil;
    const validityUntil =
      typeof validityUntilRaw === "string" && validityUntilRaw.trim() !== ""
        ? new Date(validityUntilRaw)
        : undefined;
    if (validityUntil && Number.isNaN(validityUntil.getTime())) {
      res.status(400).json({ status: "error", message: "validityUntil is invalid" });
      return;
    }

    const created = await prisma.quote.create({
      data: {
        rfqId,
        supplierId,
        totalPrice: String(totalPrice),
        currency,
        ...(validityUntil ? { validityUntil } : {}),
        items: {
          create: quoteItems,
        },
      },
      include: { items: true },
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to submit quote" });
  }
};
