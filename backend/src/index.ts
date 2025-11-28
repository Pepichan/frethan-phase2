import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT ?? 3000);

// ✅ CORS: Vite Dev (5173) を明示許可
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅
app.get("/", (_req, res) => {
  res.send("Frethan API is running. Try GET /health");
});

// ✅ Health + DB
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", time: new Date().toISOString() });
  } catch (e) {
    console.error("DB health failed:", e);
    res.status(500).json({ status: "db_error" });
  }
});

// （任意）ユーザー一覧
app.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    console.error("GET /users error:", e);
    res.status(500).json({ error: "failed_to_fetch_users" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});

// ✅ 開発時も接続をきれいに閉じる
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Add this route - usually after your other route imports
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    service: 'frethan-backend'
  });
});