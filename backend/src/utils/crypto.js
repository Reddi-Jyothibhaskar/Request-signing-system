import crypto from "crypto";

export function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function verifySignature(canonical, signature, publicKey) {
  return crypto.verify(
    "RSA-SHA256",
    Buffer.from(canonical),
    publicKey,
    Buffer.from(signature, "base64")
  );
}