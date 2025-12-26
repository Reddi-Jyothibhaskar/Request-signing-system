export async function importPrivateKey(pem) {
  const binary = atob(
    pem.replace(/-----.*?-----/g, "").replace(/\s/g, "")
  );

  const buffer = new Uint8Array([...binary].map(c => c.charCodeAt(0)));

  return crypto.subtle.importKey(
    "pkcs8",
    buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

export async function sha256(data) {
  const encoded = new TextEncoder().encode(data);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(hash)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sign(canonical, key) {
  const encoded = new TextEncoder().encode(canonical);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    encoded
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
