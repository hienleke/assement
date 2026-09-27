import { mqttConfig } from "@/config/mqtt.config.js";
import { publishMqtt } from "@/mqtt/publisher.js";
import {
  deleteBeacon,
  findBeacon,
  insertBeacon,
  listBeacons,
  updateBeacon,
} from "@/repositories/beacon.repository.js";

export function list() {
  return listBeacons();
}

export function findById(id) {
  return findBeacon(id);
}

export function create(data) {
  return insertBeacon(data);
}

export function update(id, data) {
  return updateBeacon(id, data);
}

export function remove(id) {
  return deleteBeacon(id);
}

export async function setLed(deviceId, payload) {
  const topic = `${mqttConfig.baseTopic}/${deviceId}/cmd`;
  try {
    await publishMqtt(topic, payload);
    return { ok: true, topic, payload };
  } catch (err) {
    err.topic = topic;
    throw err;
  }
}
