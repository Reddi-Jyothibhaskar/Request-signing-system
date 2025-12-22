import pool from "../config/db.js";

export async function getClientById(clientId) {
  const res = await pool.query(
    "SELECT public_key FROM api_clients WHERE client_id = $1 AND is_active = true",
    [clientId]
  );

  return res.rows[0];
}