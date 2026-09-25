import { ERRORS } from "@/constants/error.constants.js";
import { config } from "@/config/config.js";
import { onMqttMessage } from "@/mqtt/mqtt.js";

const deviceIdPattern = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

export function streamMessages(req, res) {
  const deviceId = typeof req.query.deviceId === "string" ? req.query.deviceId : "";
  if (!deviceId) {
    res.status(ERRORS.DEVICE_ID_REQUIRED.status).json({ error: ERRORS.DEVICE_ID_REQUIRED.message });
    return;
  }
  if (!deviceIdPattern.test(deviceId)) {
    res.status(ERRORS.INVALID_DEVICE_ID.status).json({ error: ERRORS.INVALID_DEVICE_ID.message });
    return;
  }

  const topic = `${config.mqtt.topic}/${deviceId}/data`;

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
  }, deviceId);

  res.on("close", () => {
    unsubscribe(topic);
  });
}
