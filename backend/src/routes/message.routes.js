import { Router } from "express";
import { config } from "../config.js";
import { listMessages } from "../db/index.js";
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

messageRouter.get("/", async (req, res, next) => {
  try {
    const result = await listMessages(req.query.limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
