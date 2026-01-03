import mongoose, { Schema, InferSchemaType } from "mongoose";

const rfqSchema = new Schema(
  {
    companyName: { type: String, required: true, trim: true, maxlength: 120 },
    contactPerson: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },

    productCategory: { type: String, required: true },
    quantity: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    specifications: { type: String, trim: true, maxlength: 2000 },

    priceRange: { type: String, trim: true, maxlength: 120 },
    urgency: { type: String, required: true },

    deliveryDateISO: { type: Date, required: true },
    deliveryLocation: { type: String, required: true, trim: true, maxlength: 180 },

    additional: { type: String, trim: true, maxlength: 2000 },

    status: { type: String, default: "new" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export type RFQDoc = InferSchemaType<typeof rfqSchema>;
export default mongoose.model("RFQ", rfqSchema);
