import { Router } from "express";
import RFQ from "../models/RFQ";

const router = Router();

function isValidEmail(v: string) {
  return /^\S+@\S+\.\S+$/.test(v);
}

router.post("/", async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      productCategory,
      quantity,
      description,
      specifications,
      priceRange,
      urgency,
      deliveryDateISO,
      deliveryLocation,
      additional
    } = req.body || {};

    const errors: Record<string, string> = {};

    if (!companyName?.trim()) errors.companyName = "Company name is required";
    if (!contactPerson?.trim()) errors.contactPerson = "Contact person is required";
    if (!email?.trim()) errors.email = "Email is required";
    else if (!isValidEmail(email)) errors.email = "Email is invalid";
    if (!phone?.trim()) errors.phone = "Phone number is required";

    if (!productCategory) errors.productCategory = "Product category is required";
    if (!quantity?.trim()) errors.quantity = "Quantity is required";
    if (!description?.trim()) errors.description = "Description is required";
    if (!urgency) errors.urgency = "Urgency level is required";

    const d = new Date(deliveryDateISO);
    if (!deliveryDateISO) errors.deliveryDate = "Delivery date is required";
    else if (Number.isNaN(d.getTime())) errors.deliveryDate = "Delivery date is invalid";

    if (!deliveryLocation?.trim()) errors.deliveryLocation = "Delivery location is required";

    if (Object.keys(errors).length) return res.status(400).json({ errors });

    const created = await RFQ.create({
      companyName,
      contactPerson,
      email,
      phone,
      productCategory,
      quantity,
      description,
      specifications: specifications || "",
      priceRange: priceRange || "",
      urgency,
      deliveryDateISO: d,
      deliveryLocation,
      additional: additional || ""
    });

    return res.status(201).json({ ok: true, rfqId: created._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (_req, res) => {
  const items = await RFQ.find().sort({ createdAt: -1 }).limit(50);
  res.json(items);
});

export default router;
