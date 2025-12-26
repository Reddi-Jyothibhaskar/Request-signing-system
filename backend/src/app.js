import express from "express";
import cors from "cors";
import protectedRoutes from "./routes/protected.routes.js";

const app = express();

/**
 * ✅ Enable CORS (Express 5 safe)
 */
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: [
    "Content-Type",
    "X-Client-Id",
    "X-Timestamp",
    "X-Signature"
  ]
}));

/**
 * ✅ Raw body capture
 */
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

app.use("/api", protectedRoutes);

export default app;
