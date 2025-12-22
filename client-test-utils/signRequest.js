import crypto from "crypto";
import fs from "fs";

/**
 * Generate RSA-SHA256 signature for a canonical string
 */
function generateSignature(canonicalString) {
  // Load private key (client-side secret)
  const privateKey = fs.readFileSync(
    "./client_private.pem",
    "utf8"
  );

  // Sign the canonical string
  const signature = crypto.sign(
    "RSA-SHA256",
    Buffer.from(canonicalString),
    privateKey
  );

  // Convert binary signature to Base64 (HTTP safe)
  return signature.toString("base64");
}

// -------------------------------
// Example usage
// -------------------------------

const method = "POST";
const path = "/api/pay";
const timestamp = Math.floor(Date.now() / 1000);
const body = JSON.stringify({amount: 100, to: "alice"});

// Step 1: Hash body
const bodyHash = crypto
  .createHash("sha256")
  .update(body)
  .digest("hex");

// Step 2: Build canonical string
const canonicalString =
  `${method}\n${path}\n${timestamp}\n${bodyHash}`;

// Step 3: Generate signature
const signature = generateSignature(canonicalString);

console.log("Canonical String:\n", canonicalString);
console.log("\nGenerated Signature:\n", signature);

// const privateKey = fs.readFileSync(
//     "./client_private.pem",
//     "utf8"
// );
// console.log("\nPrivate key:\n", privateKey)