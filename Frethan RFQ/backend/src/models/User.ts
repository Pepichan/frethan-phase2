import mongoose, { Schema, InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 180 },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, required: true, enum: ["buyer", "seller"], default: "buyer" },
    company: { type: String, trim: true, maxlength: 120 }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "buyer" | "seller";
  company?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDoc = InferSchemaType<typeof userSchema>;
export default mongoose.model<UserDocument>("User", userSchema);

