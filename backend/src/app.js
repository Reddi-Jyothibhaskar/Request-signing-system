import express from "express"
import protectedRoutes from "./routes/protected.routes.js";
// import cors from "cors";

const app = express();

// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));

// Capture raw body
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use("/api", protectedRoutes);

export default app;
