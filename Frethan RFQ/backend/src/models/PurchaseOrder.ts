import mongoose, { Schema, InferSchemaType } from "mongoose";

const purchaseOrderSchema = new Schema(
  {
    rfqId: { type: Schema.Types.ObjectId, ref: "RFQ", required: true },
    sellerId: { type: String, required: false },
    buyerId: { type: String, required: false },
    
    // RFQ details (snapshot)
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    
    productCategory: { type: String, required: true },
    quantity: { type: String, required: true },
    description: { type: String, required: true },
    specifications: { type: String },
    
    priceRange: { type: String },
    urgency: { type: String, required: true },
    deliveryDateISO: { type: Date, required: true },
    deliveryLocation: { type: String, required: true },
    additional: { type: String },
    
    // PO specific fields
    quotedPrice: { type: String, required: true },
    terms: { type: String, trim: true, maxlength: 2000 },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending"
    },
    notes: { type: String, trim: true, maxlength: 2000 }
  },
  { timestamps: true }
);

export type PurchaseOrderDoc = InferSchemaType<typeof purchaseOrderSchema>;
export default mongoose.model("PurchaseOrder", purchaseOrderSchema);

