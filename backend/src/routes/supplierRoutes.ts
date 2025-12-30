import { Router } from "express";
import {
  createSupplier,
  getSupplier,
  listSuppliers,
  updateSupplier,
} from "../controllers/supplierController";

const router = Router();

router.get("/", listSuppliers);
router.get("/:id", getSupplier);
router.post("/", createSupplier);
router.patch("/:id", updateSupplier);

export default router;
