import mqtt from "mqtt";
import { ERRORS } from "@/constants/error.constants.js";
import { config } from "@/config/config.js";
import { decodePayload, loadCertificate } from "@/util/helper.js";

let client;

const deviceListeners = new Map();
const subscribedTopics = new Set();

export function onMqttMessage(listener, deviceId = null) {
  if (deviceId) {
    if (!deviceListeners.has(deviceId)) {
      deviceListeners.set(deviceId, new Set());
    }
    deviceListeners.get(deviceId).add(listener);

    const { topic: baseTopic } = config.mqtt;
    const dynamicTopic = `${baseTopic}/${deviceId}/data`;

    if (client?.connected && !subscribedTopics.has(dynamicTopic)) {
      client.subscribe(dynamicTopic, { qos: config.mqtt.qos }, (err) => {
        if (!err) subscribedTopics.add(dynamicTopic);
      });
    }
  }

  return {
    unsubscribe: (topic) => {
      if (deviceId) {
        const listeners = deviceListeners.get(deviceId);
        if (listeners) {
          listeners.delete(listener);
          if (listeners.size === 0) {
            deviceListeners.delete(deviceId);
            client.unsubscribe(topic);
          }
        }
      }
    },
  };
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
    const initialTopics = [topic, `${topic}/+/data`];
    console.log("starting mqtt");
    client.subscribe(initialTopics, { qos }, (err) => {
      if (!err) initialTopics.forEach((t) => subscribedTopics.add(t));
    });
  });

  client.on("message", (receivedTopic, payload) => {
    const message = {
      topic: receivedTopic,
      payload: decodePayload(payload),
      receivedAt: new Date().toISOString(),
    };

    const topicParts = receivedTopic.split("/");
    const currentDeviceId = topicParts.length >= 3 ? topicParts[1] : null;

    if (currentDeviceId && deviceListeners.has(currentDeviceId)) {
      const listeners = deviceListeners.get(currentDeviceId);
      for (const listener of listeners) {
        listener(message, currentDeviceId);
      }
    }
  });

  client.on("reconnect", () => console.log("[mqtt] reconnecting..."));
  client.on("error", (err) => console.error(`[mqtt] error: ${err.message || err}`));
  client.on("close", () => console.log("[mqtt] connection closed"));

  return client;
}

export function publishMqtt(topic, payload) {
  if (!client?.connected) {
    const error = new Error(ERRORS.MQTT_NOT_CONNECTED.message);
    error.status = ERRORS.MQTT_NOT_CONNECTED.status;
    return Promise.reject(error);
  }

  const body = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    client.publish(topic, body, { qos: config.mqtt.qos }, (err) => {
      if (err) {
        const error = new Error(err.message || ERRORS.MQTT_PUBLISH_FAILED.message);
        error.status = ERRORS.MQTT_PUBLISH_FAILED.status;
        reject(error);
        return;
      }
      resolve();
    });
  });
}

export function stopMqtt() {
  if (!client) return Promise.resolve();
  return client.endAsync();
}