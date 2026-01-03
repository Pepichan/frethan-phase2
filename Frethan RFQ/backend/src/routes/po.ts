import { Router, Request, Response } from "express";
import PurchaseOrder from "../models/PurchaseOrder";
import RFQ from "../models/RFQ";

const router = Router();

// Convert RFQ to PO
router.post("/", async (req: Request, res: Response) => {
  try {
    const { rfqId, quotedPrice, terms, notes } = req.body || {};

    if (!rfqId) return res.status(400).json({ error: "RFQ ID is required" });
    if (!quotedPrice?.trim()) return res.status(400).json({ error: "Quoted price is required" });

    const rfq = await RFQ.findById(rfqId);
    if (!rfq) return res.status(404).json({ error: "RFQ not found" });

    const po = await PurchaseOrder.create({
      rfqId: rfq._id,
      sellerId: "seller", // Placeholder since no auth
      buyerId: rfq.createdBy || rfq._id.toString(), // Use createdBy from RFQ
      
      // Snapshot RFQ data
      companyName: rfq.companyName,
      contactPerson: rfq.contactPerson,
      email: rfq.email,
      phone: rfq.phone,
      productCategory: rfq.productCategory,
      quantity: rfq.quantity,
      description: rfq.description,
      specifications: rfq.specifications || "",
      priceRange: rfq.priceRange || "",
      urgency: rfq.urgency,
      deliveryDateISO: rfq.deliveryDateISO,
      deliveryLocation: rfq.deliveryLocation,
      additional: rfq.additional || "",
      
      // PO specific
      quotedPrice: quotedPrice.trim(),
      terms: terms?.trim() || "",
      notes: notes?.trim() || "",
      status: "pending"
    });

    const populated = await PurchaseOrder.findById(po._id)
      .populate("rfqId", "companyName description")
      .populate("sellerId", "name email company")
      .populate("buyerId", "name email");

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all POs
router.get("/", async (_req: Request, res: Response) => {
  try {
    const pos = await PurchaseOrder.find()
      .populate("rfqId", "companyName description productCategory")
      .sort({ createdAt: -1 });

    res.json(pos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single PO
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate("rfqId");

    if (!po) return res.status(404).json({ error: "PO not found" });
    res.json(po);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update PO status
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { status, notes, quotedPrice, terms } = req.body || {};
    const po = await PurchaseOrder.findById(req.params.id);

    if (!po) return res.status(404).json({ error: "PO not found" });

    if (quotedPrice) po.quotedPrice = quotedPrice;
    if (terms !== undefined) po.terms = terms;
    if (notes) po.notes = notes;
    if (status) po.status = status;

    await po.save();
    const updated = await PurchaseOrder.findById(po._id)
      .populate("rfqId");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

