import { createApp } from "@/app.js";
import { config } from "@/config/config.js";
import { startMqtt, stopMqtt } from "@/mqtt/client.js";

const app = createApp();

startMqtt();

const server = app.listen(config.port, () => {
  console.log(`[http] listening on http://localhost:${config.port}`);
});

function shutdown() {
  console.log("\n[http] shutting down");
  server.close();
  stopMqtt().finally(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
