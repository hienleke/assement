import { getMqttClient } from "./client.js";
import { ERRORS } from "@/constants/error.constants.js";
import { config } from "@/config/config.js";

export function publishMqtt(topic, payload) {
  const client = getMqttClient();

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
        return reject(error);
      }
      resolve();
    });
  });
}