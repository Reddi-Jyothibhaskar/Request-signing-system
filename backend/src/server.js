import app from "./app.js";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

pool.on("connect", () => {
  console.log("✅ Connected to Neon PostgreSQL");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});