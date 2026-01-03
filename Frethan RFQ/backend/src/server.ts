import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import rfqRoutes from "./routes/rfq";
import authRoutes from "./routes/auth";
import poRoutes from "./routes/po";

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
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

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function start() {
  const uri = process.env.MONGO_URI;
  if (!uri || !(uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))) {
    console.error("❌ MONGO_URI missing/invalid. Put a real mongodb:// or mongodb+srv:// URI in backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

start();
