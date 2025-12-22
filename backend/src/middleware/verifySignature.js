import { sha256, verifySignature } from "../utils/crypto.js";
import { getClientById } from "../services/client.service.js";

export async function verifySignedRequest(req, res, next) {
  try {
    const clientId = req.header("X-Client-Id");
    const timestamp = req.header("X-Timestamp");
    const signature = req.header("X-Signature");

    if (!clientId || !timestamp || !signature) {
      return res.status(400).json({ error: "Missing signature headers" });
    }

    // Replay protection
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > process.env.TIMESTAMP_TOLERANCE) {
      return res.status(401).json({ error: "Request expired" });
    }

    const client = await getClientById(clientId);
    if (!client) {
      return res.status(401).json({ error: "Invalid client" });
    }

    const bodyHash = sha256(
      req.rawBody || JSON.stringify(req.body || "")
    );

    const canonical = `${req.method}\n${req.originalUrl}\n${timestamp}\n${bodyHash}`;

    console.log("SERVER CANONICAL:\n" + canonical);

    const isValid = verifySignature(
      canonical,
      signature,
      client.public_key
    );

    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signature verification failed" });
  }
}


