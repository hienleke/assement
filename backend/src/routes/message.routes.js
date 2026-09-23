import { Router } from "express";
import { config } from "../config.js";
import { onMqttMessage } from "../mqtt/client.js";

export const messageRouter = Router();

messageRouter.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const writeEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  writeEvent("ready", { ok: true, topic: config.mqtt.topic });

  const unsubscribe = onMqttMessage((message) => {
    writeEvent("message", message);
  });

  const heartbeat = setInterval(() => {
    res.write(": ping\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

messageRouter.get("/", (_req, res) => {
  res.json({ count: 0, messages: [] });
});
