import { createApp } from "@/app.js";
import { config } from "@/config/config.js";
import { initMqttClient, stopMqtt } from "@/mqtt/client.js";
import { setupMessageDispatcher } from "@/mqtt/subscriptionManager.js";

const app = createApp();



const server = app.listen(config.port, () => {
  console.log(`[http] listening on http://localhost:${config.port}`);
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
