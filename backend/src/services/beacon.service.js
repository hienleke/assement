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
import { commandRegistry } from "@/mqtt/commands/registry.js";

export async function list(page = 1, limit = 10) {
  const result = await listBeacons(page, limit);
  const total = Number(result.total ?? 0);
  return {
    data: result.data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
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

export async function sendCommandToDevice(deviceId, payload) {
  const topic = `${mqttConfig.baseTopic}/${deviceId}/cmd`;
  const handler = commandRegistry[payload.action];

  if (!handler) {
    throw new AppError(
      ERRORS.INVALID_COMMAND.message,
      ERRORS.INVALID_COMMAND.status,
      ERRORS.INVALID_COMMAND.code
    );
  }

  const commandPayload = handler(payload);
  try {
    console.log("publishMqtt", topic, commandPayload);
    await publishMqtt(topic, commandPayload);
    return { ok: true, topic, commandPayload };
  } catch (err) {
    err.topic = topic;
    throw new AppError(ERRORS.MQTT_PUBLISH_FAILED.message, ERRORS.MQTT_PUBLISH_FAILED.status, ERRORS.MQTT_PUBLISH_FAILED.code);
  }
}
