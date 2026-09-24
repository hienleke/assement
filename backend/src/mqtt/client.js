import fs from "node:fs";
import mqtt from "mqtt";
import { config } from "../config.js";

let client;
const listeners = new Set();

export function onMqttMessage(listener) {
  listeners.add(listener);
  return {
    unsubscribe: () => {
      console.log("unsubscribe", listener);
      listeners.delete(listener);
    },
  };
}

function decodePayload(payload) {
  const text = payload.toString("utf8");
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function loadCertificate(certificatePath) {
  if (!certificatePath) return undefined;
  const ca = fs.readFileSync(certificatePath);
  console.log(`[mqtt] using CA certificate ${certificatePath} (${ca.length} bytes)`);
  return ca;
}

export function startMqtt() {
  const { url, username, password, certificate, clientId, topic, qos } = config.mqtt;
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

  client.on("connect", () => {
    console.log(`[mqtt] connected ${url} as ${clientId}`);
    client.subscribe(topic, { qos }, (err) => {
      if (err) {
        console.error(`[mqtt] subscribe failed: ${err.message}`);
        return;
      }
      console.log(`[mqtt] subscribed topic="${topic}" qos=${qos}`);
    });
  });

  client.on("message", (receivedTopic, payload) => {
    const message = {
      topic: receivedTopic,
      payload: decodePayload(payload),
      receivedAt: new Date().toISOString(),
    };
    console.log(`[mqtt] ${receivedTopic}`, message.payload);
    for (const listener of listeners) {
      listener(message);
    }
  });

  client.on("reconnect", () => {
    console.log("[mqtt] reconnecting...");
  });

  client.on("error", (err) => {
    const reason = {
      4: "bad username or password",
      5: "not authorized",
    }[err.code];
    console.error(`[mqtt] error: ${reason || err.code || err.message || err}`);
  });

  client.on("close", () => {
    console.log("[mqtt] connection closed");
  });

  return client;
}

export function publishMqtt(topic, payload) {
  if (!client?.connected) {
    const error = new Error("mqtt not connected");
    error.status = 503;
    return Promise.reject(error);
  }

  const body = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    client.publish(topic, body, { qos: config.mqtt.qos }, (err) => {
      if (err) {
        const error = new Error(err.message || "mqtt publish failed");
        error.status = 502;
        reject(error);
        return;
      }
      console.log(`[mqtt] published topic="${topic}"`, payload);
      resolve();
    });
  });
}

export function stopMqtt() {
  if (!client) return Promise.resolve();
  return client.endAsync();
}
