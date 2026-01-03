// Vercel serverless function entry point
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import rfqRoutes from "../backend/src/routes/rfq";
import authRoutes from "../backend/src/routes/auth";
import poRoutes from "../backend/src/routes/po";

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";
app.use(cors({ origin: frontendOrigin }));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/rfqs", rfqRoutes);
app.use("/api/pos", poRoutes);

// Connect to MongoDB
const uri = process.env.MONGO_URI;
if (uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))) {
  mongoose.connect(uri).catch(console.error);
}

export default app;

