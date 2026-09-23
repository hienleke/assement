import { createApp } from "./app.js";
import { config } from "./config.js";
import { db } from "./db/index.js";
import { startMqtt, stopMqtt } from "./mqtt/client.js";

const app = createApp();

startMqtt();

const server = app.listen(config.port, () => {
  console.log(`[http] listening on http://localhost:${config.port}`);
  console.log("[http] GET /health");
  console.log("[http] GET /messages");
  console.log("[http] GET /messages/stream");
});

function shutdown() {
  console.log("\n[http] shutting down");
  server.close();
  stopMqtt()
    .then(() => db.destroy())
    .finally(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
