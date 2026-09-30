import { mqttConfig } from "@/config/mqtt.config.js";
import { publishMqtt } from "@/mqtt/publisher.js";
import { AppError } from "@/error/AppError.js";
import { ERRORS } from "@/constants/error.constants.js";
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
  const beacon = findBeacon(id);
  if (!beacon) {
    throw new AppError(ERRORS.BEACON_NOT_FOUND.message, ERRORS.BEACON_NOT_FOUND.status, ERRORS.BEACON_NOT_FOUND.code);
  }
  return beacon;
}

export function create(data) {
  const created = insertBeacon(data);
  if (!created) {
    throw new AppError(ERRORS.BEACON_NOT_FOUND.message, ERRORS.BEACON_NOT_FOUND.status, ERRORS.BEACON_NOT_FOUND.code);
  }
  return created;
}

export function update(id, data) {
  const updated = updateBeacon(id, data);
  if (!updated) {
    throw new AppError(ERRORS.BEACON_NOT_FOUND.message, ERRORS.BEACON_NOT_FOUND.status, ERRORS.BEACON_NOT_FOUND.code);
  }
  return updated;
}

export function remove(id) {
  const deleted = deleteBeacon(id);
  if (!deleted) {
    throw new AppError(ERRORS.BEACON_NOT_FOUND.message, ERRORS.BEACON_NOT_FOUND.status, ERRORS.BEACON_NOT_FOUND.code);
  }
  return deleted;
}

export async function setLed(deviceId, payload) {
  const topic = `${mqttConfig.baseTopic}/${deviceId}/cmd`;
  try {
    await publishMqtt(topic, payload);
    return { ok: true, topic, payload };
  } catch (err) {
    err.topic = topic;
    throw new AppError(ERRORS.MQTT_PUBLISH_FAILED.message, ERRORS.MQTT_PUBLISH_FAILED.status, ERRORS.MQTT_PUBLISH_FAILED.code);
  }
}
