import { db } from "./knex.js";

function mapRow(row) {
  return {
    id: row.id,
    topic: row.topic,
    payload: row.payload,
    receivedAt: row.received_at,
  };
}

export async function saveMessage({ topic, payload, receivedAt }) {
  await db("mqtt_messages").insert({
    topic,
    payload,
    received_at: receivedAt,
  });
}

export async function listMessages(limit = 50) {
  const size = Math.min(Math.max(Number(limit) || 50, 1), 200);
  const [rows, total] = await Promise.all([
    db("mqtt_messages").select("id", "topic", "payload", "received_at").orderBy("id", "desc").limit(size),
    db("mqtt_messages").count("* as count").first(),
  ]);

  return {
    count: Number(total.count),
    messages: rows.map(mapRow),
  };
}
