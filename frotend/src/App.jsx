import { useState } from "react";
import { importPrivateKey, sha256, sign } from "./crypto";
import { toast } from "./toast";

export default function App() {
  const ENDPOINT = "http://localhost:4000/api/pay";
  const METHOD = "POST";

  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const [privateKey, setPrivateKey] = useState(null);
  const [signature, setSignature] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  async function loadKey(e) {
    const pem = await e.target.files[0].text();
    const key = await importPrivateKey(pem);
    setPrivateKey(key);
    toast("Private key loaded");
  }

  async function createSignature() {
    if (!clientId || !amount || !to || !privateKey) {
      toast("Fill all fields", "error");
      return;
    }

    const body = JSON.stringify({
      amount: Number(amount),
      to
    });

    const ts = Math.floor(Date.now() / 1000).toString();
    const bodyHash = await sha256(body);

    const canonical =
      `${METHOD}\n/api/pay\n${ts}\n${bodyHash}`;

    const sig = await sign(canonical, privateKey);

    setSignature(sig);
    setTimestamp(ts);

    toast("Signature created successfully");
  }

  async function sendRequest() {
    const body = JSON.stringify({
      amount: Number(amount),
      to
    });

    const res = await fetch(ENDPOINT, {
      method: METHOD,
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": clientId,
        "X-Timestamp": timestamp,
        "X-Signature": signature
      },
      body
    });

    const data = await res.json();

    if (res.ok) {
      toast("Request accepted by server");
    } else {
      toast(data.error || "Request failed", "error");
    }
  }

  return (
    <div className="container">
      <h1>Signed API Client</h1>

      <input
        placeholder="Client ID"
        value={clientId}
        onChange={e => setClientId(e.target.value)}
      />
      <label>Upload privatekey</label>
      <input type="file" accept=".pem" onChange={loadKey} />

      <input
        placeholder="Amount (e.g. 100)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <input
        placeholder="Recipient name (e.g. Alice)"
        value={to}
        onChange={e => setTo(e.target.value)}
      />

      {!signature && (
        <button onClick={createSignature}>
          Create Signature
        </button>
      )}

      {signature && (
        <button className="send" onClick={sendRequest}>
          Send Request
        </button>
      )}
    </div>
  );
}
