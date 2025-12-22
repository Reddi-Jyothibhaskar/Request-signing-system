import { Router } from "express";
import { verifySignedRequest } from "../middleware/verifySignature.js";

const router = Router();

router.post("/pay", verifySignedRequest, (req, res) => {
  res.json({
    message: "Payment accepted",
    data: req.body,
  });
});

export default router;
