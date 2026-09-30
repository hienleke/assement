
import { registerDeviceListener } from "@/mqtt/subscription.js";

export function streamMessages(req, res) {
  const { deviceId } = req.validated;

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const writeEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  writeEvent("ready", { ok: true });

  const { unsubscribe } = registerDeviceListener(deviceId, (message) => {
    writeEvent("message", message);
  });
  res.on("close", () => {
    unsubscribe();
  });
}
