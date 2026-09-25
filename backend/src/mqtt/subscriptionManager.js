import { getMqttClient } from "./client.js";
import { config } from "@/config/config.js";
import { decodePayload } from "@/utils/helper.js";

const deviceListeners = new Map();
const subscribedTopics = new Set();


export function registerDeviceListener(deviceId, listener) {
  const client = getMqttClient();

  if (!deviceListeners.has(deviceId)) {
    deviceListeners.set(deviceId, new Set());
  }
  deviceListeners.get(deviceId).add(listener);

  const { baseTopic } = config.mqtt;
  const dynamicTopic = `${baseTopic}/${deviceId}/data`;

  if (client?.connected && !subscribedTopics.has(dynamicTopic)) {
    client.subscribe(dynamicTopic, { qos: config.mqtt.qos }, (err) => {
      if (!err) subscribedTopics.add(dynamicTopic);
    });
  }

  // Trả về hàm unsubscribe sạch sẽ
  return {
    unsubscribe: () => {
      const listeners = deviceListeners.get(deviceId);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          deviceListeners.delete(deviceId);
          subscribedTopics.delete(dynamicTopic);
          client?.unsubscribe(dynamicTopic);
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