import { getMqttClient } from "@/mqtt/client.js";
import { mqttConfig } from "@/config/mqtt.config.js";
import { decodePayload } from "@/utils/helper.js";

const deviceListeners = new Map();
const subscribedTopics = new Set();

export function registerDeviceListener(deviceId, listener) {
  const client = getMqttClient();

  if (!deviceListeners.has(deviceId)) {
    deviceListeners.set(deviceId, new Set());
  }
  deviceListeners.get(deviceId).add(listener);

  const { baseTopic } = mqttConfig;
  const registeredTopic = `${baseTopic}/${deviceId}/data`;

  if (client?.connected && !subscribedTopics.has(registeredTopic)) {
    client.subscribe(registeredTopic, { qos: mqttConfig.qos }, (err) => {
      if (!err) subscribedTopics.add(registeredTopic);
    });
  }

  return {
    unsubscribe: () => {
      const listeners = deviceListeners.get(deviceId);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          deviceListeners.delete(deviceId);
          subscribedTopics.delete(registeredTopic);
          client?.unsubscribe(registeredTopic);
        }
      }
    },
  };
}

export function setupMessageDispatcher() {
  const client = getMqttClient();
  if (!client) return;

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
}
