import { onMqttMessage } from "@/mqtt/client.js";

const deviceIdPattern = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

export function streamMessages(req, res) {
  const deviceId = typeof req.query.deviceId === "string" ? req.query.deviceId : "";
  if (!deviceId) {
    res.status(400).json({ error: "device id is required" });
    return;
  }
  if (!deviceIdPattern.test(deviceId)) {
    res.status(400).json({ error: "invalid device id" });
    return;
  }

  const topic = `zena/${deviceId}/data`;

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const writeEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  writeEvent("ready", { ok: true, topic });

  const { unsubscribe } = onMqttMessage((message) => {
    if (message.topic !== topic) return;
    writeEvent("message", message);
  });

  res.on("close", () => {
    unsubscribe();
  });
}
