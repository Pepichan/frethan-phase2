const express = require("express")
const cors = require("cors")

const app = express()

// ✅ localhost と 127.0.0.1 の両方を許可
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}))

app.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() })
})

app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000")
})
