import mqtt from "mqtt";
import { config } from "@/config/config.js";
import { loadCertificate } from "@/utils/helper.js";

let client = null;

export function initMqttClient() {
  if (client) return client;

  const { url, username, password, certificate, clientId } = config.mqtt;
  const ca = loadCertificate(certificate);

  client = mqtt.connect(url, {
    clientId,
    username,
    password,
    ca,
    rejectUnauthorized: true,
    reconnectPeriod: 3000,
    connectTimeout: 10_000,
    clean: true,
  });

  client.on("reconnect", () => console.log("[mqtt] reconnecting..."));
  client.on("error", (err) => console.error(`[mqtt] error: ${err.message || err}`));
  client.on("close", () => console.log("[mqtt] connection closed"));

  return client;
}

export function getMqttClient() {
  return client;
}

export async function stopMqtt() {
  if (!client) return Promise.resolve();
  await client.endAsync();
  client = null;
}