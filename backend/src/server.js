import { createApp } from "@/app.js";
import { port } from "@/config/db.config.js";
import { initMqttClient, stopMqtt } from "@/mqtt/client.js";
import { setupMessageDispatcher } from "@/mqtt/subscription.js";

const app = createApp();

const server = app.listen(port, () => {
  console.log(`[http] listening on http://localhost:${port}`);
  let client = initMqttClient();
  setupMessageDispatcher();
  client.on("connect", () => {
    console.log("[mqtt] connected");
  });
});

function shutdown() {
  console.log("\n[http] shutting down");
  server.close();
  stopMqtt().finally(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
